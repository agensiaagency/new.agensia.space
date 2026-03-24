import express from 'express';
import Stripe from 'stripe';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';
import { PRICE_MAP, PACKAGE_DESCRIPTIONS, TERM_LABELS } from '../constants/pricing.js';
import { sendEmail } from './emails.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  const { packageKey, term, userId, email } = req.body;

  if (!packageKey || !term || !userId || !email) {
    return res.status(400).json({
      error: 'packageKey, term, userId, and email are required',
    });
  }

  if (!PRICE_MAP[packageKey]) {
    return res.status(400).json({
      error: `Invalid packageKey. Valid options: ${Object.keys(PRICE_MAP).join(', ')}`,
    });
  }

  if (!PRICE_MAP[packageKey][term]) {
    return res.status(400).json({
      error: `Invalid term for ${packageKey}. Valid options: ${Object.keys(PRICE_MAP[packageKey]).join(', ')}`,
    });
  }

  const unitAmount = PRICE_MAP[packageKey][term];
  const packageName = `${packageKey.charAt(0).toUpperCase() + packageKey.slice(1)} - ${TERM_LABELS[term]}`;
  const description = PACKAGE_DESCRIPTIONS[packageKey];

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card', 'sepa_debit'],
    customer_email: email,
    client_reference_id: userId,
    metadata: {
      packageKey,
      term,
      userId,
    },
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: unitAmount,
          recurring: {
            interval: 'month',
          },
          product_data: {
            name: packageName,
            description: description,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/overview?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/overview?payment=cancelled`,
  });

  logger.info(`Checkout session created: ${session.id} for user ${userId}`);

  res.json({
    sessionId: session.id,
    url: session.url,
  });
});

// POST /api/stripe/webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    throw new Error('Webhook signature or secret missing');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }

  logger.info(`Processing webhook event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const packageKey = session.metadata.packageKey;
      const term = session.metadata.term;
      const monthlyPrice = PRICE_MAP[packageKey][term];

      const user = await pb.collection('users').getOne(userId);

      await pb.collection('users').update(userId, {
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        selected_package: packageKey,
        selected_term: term,
        monthly_price: monthlyPrice,
        hosting_status: 'active',
        hosting_start: new Date().toISOString(),
      });

      await pb.collection('payments').create({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_customer_id: session.customer,
        amount: session.amount_total,
        currency: session.currency,
        status: 'completed',
        payment_method: session.payment_method_types[0],
      });

      await pb.collection('hosting_logs').create({
        user_id: userId,
        type: 'activation',
        description: `Subscription activated for ${packageKey} package`,
        metadata: JSON.stringify({ package: packageKey, term, monthlyPrice }),
      });

      await pb.collection('notifications').create({
        user_id: userId,
        category: 'System',
        title: 'Abo aktiviert',
        message: `Dein ${packageKey} Abo ist nun aktiv.`,
        is_read: false,
      });

      await sendEmail('subscriptionActivated', {
        name: user.name || 'Kunde',
        email: user.email,
        package: packageKey,
      });

      logger.info(`Subscription activated for user ${userId}`);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      const users = await pb.collection('users').getFullList({
        filter: `stripe_customer_id = "${customerId}"`,
      });

      if (users.length > 0) {
        const user = users[0];

        await pb.collection('payments').create({
          user_id: user.id,
          stripe_invoice_id: invoice.id,
          stripe_customer_id: customerId,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'completed',
        });

        await pb.collection('hosting_logs').create({
          user_id: user.id,
          type: 'payment_succeeded',
          description: `Payment for invoice ${invoice.number} succeeded.`,
          metadata: JSON.stringify({ invoice_id: invoice.id }),
        });

        logger.info(`Payment succeeded for user ${user.id}`);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const customerId = invoice.customer;

      const users = await pb.collection('users').getFullList({
        filter: `stripe_customer_id = "${customerId}"`,
      });

      if (users.length > 0) {
        const user = users[0];

        await pb.collection('users').update(user.id, {
          hosting_status: 'payment_failed',
        });

        await pb.collection('hosting_logs').create({
          user_id: user.id,
          type: 'payment_failed',
          description: `Payment for invoice ${invoice.number} failed.`,
          metadata: JSON.stringify({ invoice_id: invoice.id }),
        });

        await pb.collection('notifications').create({
          user_id: user.id,
          category: 'System',
          title: 'Zahlung fehlgeschlagen',
          message: 'Die Zahlung für dein Abo ist fehlgeschlagen. Bitte prüfe deine Zahlungsmethode.',
          is_read: false,
        });

        await sendEmail('paymentFailed', {
          name: user.name || 'Kunde',
          email: user.email,
        });

        logger.info(`Payment failed for user ${user.id}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      const users = await pb.collection('users').getFullList({
        filter: `stripe_customer_id = "${customerId}"`,
      });

      if (users.length > 0) {
        const user = users[0];
        const endDate = new Date().toISOString();

        await pb.collection('users').update(user.id, {
          hosting_status: 'cancelled',
          hosting_end: endDate,
        });

        await pb.collection('hosting_logs').create({
          user_id: user.id,
          type: 'cancellation',
          description: 'Subscription cancelled',
          metadata: JSON.stringify({ subscription_id: subscription.id }),
        });

        await pb.collection('notifications').create({
          user_id: user.id,
          category: 'System',
          title: 'Abo gekündigt',
          message: 'Dein Abonnement wurde erfolgreich gekündigt.',
          is_read: false,
        });

        await sendEmail('subscriptionCancelled', {
          name: user.name || 'Kunde',
          email: user.email,
          endDate: new Date().toLocaleDateString('de-DE'),
        });

        logger.info(`Subscription cancelled for user ${user.id}`);
      }
      break;
    }

    default:
      logger.info(`Unhandled webhook event type: ${event.type}`);
  }

  res.json({ received: true });
});

// GET /api/stripe/subscription/:userId
router.get('/subscription/:userId', async (req, res) => {
  const { userId } = req.params;

  const user = await pb.collection('users').getOne(userId);

  if (!user.stripe_subscription_id) {
    return res.json({
      status: 'inactive',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      plan: null,
    });
  }

  const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);

  const plan = {
    package: user.selected_package,
    term: user.selected_term,
    monthlyPrice: user.monthly_price,
  };

  res.json({
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    plan,
  });
});

// POST /api/stripe/cancel-subscription
router.post('/cancel-subscription', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const user = await pb.collection('users').getOne(userId);

  if (!user.stripe_subscription_id) {
    throw new Error('User has no active subscription');
  }

  const subscription = await stripe.subscriptions.update(user.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  await pb.collection('users').update(userId, {
    hosting_status: 'cancelled',
  });

  await pb.collection('hosting_logs').create({
    user_id: userId,
    type: 'cancellation',
    description: `Subscription scheduled for cancellation at period end: ${new Date(subscription.cancel_at * 1000).toISOString()}`,
  });

  logger.info(`Subscription cancellation scheduled for user ${userId}`);

  res.json({
    success: true,
    cancelAt: new Date(subscription.cancel_at * 1000).toISOString(),
  });
});

// POST /api/stripe/update-subscription
router.post('/update-subscription', async (req, res) => {
  const { userId, newPackageKey, newTerm } = req.body;

  if (!userId || !newPackageKey || !newTerm) {
    return res.status(400).json({
      error: 'userId, newPackageKey, and newTerm are required',
    });
  }

  if (!PRICE_MAP[newPackageKey]) {
    return res.status(400).json({
      error: `Invalid newPackageKey. Valid options: ${Object.keys(PRICE_MAP).join(', ')}`,
    });
  }

  if (!PRICE_MAP[newPackageKey][newTerm]) {
    return res.status(400).json({
      error: `Invalid newTerm for ${newPackageKey}. Valid options: ${Object.keys(PRICE_MAP[newPackageKey]).join(', ')}`,
    });
  }

  const user = await pb.collection('users').getOne(userId);

  if (!user.stripe_subscription_id) {
    throw new Error('User has no active subscription');
  }

  const oldPackage = user.selected_package;
  const oldTerm = user.selected_term;
  const newMonthlyPrice = PRICE_MAP[newPackageKey][newTerm];

  const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);

  if (!subscription.items.data || subscription.items.data.length === 0) {
    throw new Error('Subscription has no items');
  }

  const itemId = subscription.items.data[0].id;

  const updatedSubscription = await stripe.subscriptions.update(user.stripe_subscription_id, {
    items: [
      {
        id: itemId,
        price_data: {
          currency: 'eur',
          unit_amount: newMonthlyPrice,
          recurring: {
            interval: 'month',
          },
          product_data: {
            name: `${newPackageKey.charAt(0).toUpperCase() + newPackageKey.slice(1)} - ${TERM_LABELS[newTerm]}`,
            description: PACKAGE_DESCRIPTIONS[newPackageKey],
          },
        },
      },
    ],
    proration_behavior: 'create_prorations',
  });

  await pb.collection('users').update(userId, {
    selected_package: newPackageKey,
    selected_term: newTerm,
    monthly_price: newMonthlyPrice,
  });

  const upgradeType = newMonthlyPrice > PRICE_MAP[oldPackage][oldTerm] ? 'upgrade' : 'downgrade';

  await pb.collection('hosting_logs').create({
    user_id: userId,
    type: upgradeType,
    description: `Package ${upgradeType}d from ${oldPackage} (${oldTerm}m) to ${newPackageKey} (${newTerm}m)`,
    metadata: JSON.stringify({
      old_package: oldPackage,
      new_package: newPackageKey,
      new_price: newMonthlyPrice,
    }),
  });

  await pb.collection('notifications').create({
    user_id: userId,
    category: 'System',
    title: 'Abo aktualisiert',
    message: `Dein Abonnement wurde auf ${newPackageKey} aktualisiert.`,
    is_read: false,
  });

  logger.info(`Subscription updated for user ${userId}: ${oldPackage} → ${newPackageKey}`);

  res.json({
    success: true,
    subscription: updatedSubscription,
    newMonthlyPrice: newMonthlyPrice / 100,
  });
});

export default router;
