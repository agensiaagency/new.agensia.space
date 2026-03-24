import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /api/webhooks/create
router.post('/create', async (req, res) => {
  const { event_type, url, active = true } = req.body;

  if (!event_type || !url) {
    return res.status(400).json({ error: 'event_type and url are required' });
  }

  const webhook = await pb.collection('webhooks').create({
    event_type,
    url,
    active,
  });

  logger.info(`Webhook created: ${webhook.id}`);

  res.json({
    webhook_id: webhook.id,
    event_type: webhook.event_type,
    url: webhook.url,
    active: webhook.active,
  });
});

// POST /api/webhooks/:id/test
router.post('/:id/test', async (req, res) => {
  const { id } = req.params;

  const webhook = await pb.collection('webhooks').getOne(id);
  if (!webhook) {
    throw new Error('Webhook not found');
  }

  const testPayload = {
    event: webhook.event_type,
    timestamp: new Date().toISOString(),
    test: true,
  };

  let statusCode = 500;
  let responseText = '';
  let success = false;

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    statusCode = response.status;
    responseText = await response.text();
    success = response.ok;
  } catch (error) {
    responseText = error.message;
  }

  await pb.collection('webhook_logs').create({
    webhook_id: id,
    event_type: webhook.event_type,
    status_code: statusCode,
    response: responseText,
    success,
  });

  logger.info(`Webhook test: ${id}, status: ${statusCode}`);

  res.json({
    success,
    status_code: statusCode,
    response: responseText,
  });
});

// GET /api/webhooks/logs
router.get('/logs', async (req, res) => {
  const { webhook_id, status, date_range } = req.query;

  let filterQuery = '';
  if (webhook_id) {
    filterQuery = `webhook_id = "${webhook_id}"`;
  }

  if (status) {
    if (filterQuery) filterQuery += ' && ';
    filterQuery += `success = ${status === 'success' ? 'true' : 'false'}`;
  }

  if (date_range) {
    const { start, end } = JSON.parse(date_range);
    if (filterQuery) filterQuery += ' && ';
    filterQuery += `created >= "${start}" && created <= "${end}"`;
  }

  const logs = await pb.collection('webhook_logs').getFullList({
    filter: filterQuery,
    sort: '-created',
  });

  res.json(logs);
});

export default router;