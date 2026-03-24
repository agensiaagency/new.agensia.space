import express from 'express';
import pb from '../utils/pocketbase.js';
import { sendEmail } from '../utils/email.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /api/invoices/generate
router.post('/generate', async (req, res) => {
  const { customer_id, items, due_date } = req.body;

  if (!customer_id || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'customer_id and items array are required' });
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const invoiceNumber = `INV-${Date.now()}`;

  const invoice = await pb.collection('invoices').create({
    customer_id,
    invoice_number: invoiceNumber,
    amount: totalAmount,
    items: JSON.stringify(items),
    due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
  });

  logger.info(`Invoice created: ${invoice.id}`);

  res.json({
    invoice_id: invoice.id,
    invoice_number: invoice.invoice_number,
    pdf_url: `/api/invoices/${invoice.id}/pdf`,
  });
});

// POST /api/invoices/:id/send
router.post('/:id/send', async (req, res) => {
  const { id } = req.params;

  const invoice = await pb.collection('invoices').getOne(id, {
    expand: 'customer_id',
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const customer = invoice.expand?.customer_id;
  if (!customer || !customer.email) {
    throw new Error('Customer email not found');
  }

  const result = await sendEmail(customer.email, 'payment_reminder', {
    invoiceNumber: invoice.invoice_number,
    amount: invoice.amount,
    dueDate: new Date(invoice.due_date).toLocaleDateString(),
  });

  await pb.collection('invoices').update(id, {
    sent_at: new Date().toISOString(),
  });

  logger.info(`Invoice ${id} sent to ${customer.email}`);

  res.json({
    success: true,
    message_id: result.message_id,
  });
});

// POST /api/invoices/:id/mark-paid
router.post('/:id/mark-paid', async (req, res) => {
  const { id } = req.params;

  const invoice = await pb.collection('invoices').update(id, {
    status: 'paid',
    paid_at: new Date().toISOString(),
  });

  logger.info(`Invoice ${id} marked as paid`);

  res.json(invoice);
});

export default router;