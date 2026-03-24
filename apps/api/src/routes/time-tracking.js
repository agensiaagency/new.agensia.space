import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

const activeSessions = new Map();

// POST /api/time-tracking/start
router.post('/start', async (req, res) => {
  const { project_id, task_id, activity_description } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: 'project_id is required' });
  }

  const sessionId = `session-${Date.now()}`;
  const startTime = new Date();

  activeSessions.set(sessionId, {
    sessionId,
    project_id,
    task_id,
    activity_description,
    start_time: startTime,
  });

  logger.info(`Time tracking started: ${sessionId}`);

  res.json({
    session_id: sessionId,
    start_time: startTime.toISOString(),
  });
});

// POST /api/time-tracking/stop
router.post('/stop', async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  const session = activeSessions.get(session_id);
  if (!session) {
    throw new Error('Session not found');
  }

  const endTime = new Date();
  const durationMinutes = Math.round((endTime - session.start_time) / 60000);

  const entry = await pb.collection('time_entries').create({
    project_id: session.project_id,
    task_id: session.task_id || null,
    activity_description: session.activity_description,
    start_time: session.start_time.toISOString(),
    end_time: endTime.toISOString(),
    duration_minutes: durationMinutes,
  });

  activeSessions.delete(session_id);

  logger.info(`Time tracking stopped: ${session_id}, duration: ${durationMinutes} minutes`);

  res.json({
    duration_minutes: durationMinutes,
    entry_id: entry.id,
  });
});

// POST /api/time-tracking/entries
router.post('/entries', async (req, res) => {
  const { admin_id, project_id, date_range } = req.body;

  let filterQuery = '';
  if (project_id) {
    filterQuery = `project_id = "${project_id}"`;
  }

  if (date_range) {
    const { start, end } = date_range;
    if (filterQuery) filterQuery += ' && ';
    filterQuery += `created >= "${start}" && created <= "${end}"`;
  }

  const entries = await pb.collection('time_entries').getFullList({
    filter: filterQuery,
    sort: '-created',
  });

  const groupedByDay = {};
  const groupedByProject = {};

  entries.forEach(entry => {
    const date = new Date(entry.created).toISOString().split('T')[0];
    const hours = (entry.duration_minutes / 60).toFixed(2);

    if (!groupedByDay[date]) {
      groupedByDay[date] = { date, total_hours: 0, entries: [] };
    }
    groupedByDay[date].total_hours += parseFloat(hours);
    groupedByDay[date].entries.push(entry);

    if (!groupedByProject[entry.project_id]) {
      groupedByProject[entry.project_id] = { project_id: entry.project_id, total_hours: 0, entries: [] };
    }
    groupedByProject[entry.project_id].total_hours += parseFloat(hours);
    groupedByProject[entry.project_id].entries.push(entry);
  });

  res.json({
    entries: entries,
    by_day: Object.values(groupedByDay),
    by_project: Object.values(groupedByProject),
  });
});

export default router;