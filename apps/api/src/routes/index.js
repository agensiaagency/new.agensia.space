import express from 'express';
import healthCheck from './health-check.js';
import analyticsRouter from './analytics.js';
import exportsRouter from './exports.js';
import invoicesRouter from './invoices.js';
import timeTrackingRouter from './time-tracking.js';
import notificationsRouter from './notifications.js';
import webhooksRouter from './webhooks.js';
import automationsRouter from './automations.js';
import emailsRouter from './emails.js';
import stripeRouter from './stripe.js';

export default function routes() {
  const router = express.Router();

  router.get('/health', healthCheck);
  router.use('/analytics', analyticsRouter);
  router.use('/exports', exportsRouter);
  router.use('/invoices', invoicesRouter);
  router.use('/time-tracking', timeTrackingRouter);
  router.use('/notifications', notificationsRouter);
  router.use('/webhooks', webhooksRouter);
  router.use('/automations', automationsRouter);
  router.use('/emails', emailsRouter);
  router.use('/stripe', stripeRouter);

  return router;
}