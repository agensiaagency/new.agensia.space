import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/notifications
router.get('/', async (req, res) => {
  const { user_id, limit = 20, unread_only } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  let filterQuery = `user_id = "${user_id}"`;
  if (unread_only === 'true') {
    filterQuery += ' && is_read = false';
  }

  const notifications = await pb.collection('notifications').getFullList({
    filter: filterQuery,
    sort: '-created',
    requestKey: null,
  });

  const limited = notifications.slice(0, parseInt(limit));

  res.json(limited);
});

// POST /api/notifications/:id/read
router.post('/:id/read', async (req, res) => {
  const { id } = req.params;

  const notification = await pb.collection('notifications').update(id, {
    is_read: true,
    read_at: new Date().toISOString(),
  });

  logger.info(`Notification ${id} marked as read`);

  res.json(notification);
});

export default router;