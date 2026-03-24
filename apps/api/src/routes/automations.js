import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /api/automations/create
router.post('/create', async (req, res) => {
  const { trigger, action, config } = req.body;

  if (!trigger || !action) {
    return res.status(400).json({ error: 'trigger and action are required' });
  }

  const automation = await pb.collection('automations').create({
    trigger,
    action,
    config: typeof config === 'string' ? config : JSON.stringify(config || {}),
    active: true,
  });

  logger.info(`Automation created: ${automation.id}`);

  res.json({
    automation_id: automation.id,
    trigger: automation.trigger,
    action: automation.action,
    active: automation.active,
  });
});

export default router;