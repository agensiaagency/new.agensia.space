import express from 'express';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/analytics/kpis
router.get('/kpis', async (req, res) => {
  const invoices = await pb.collection('invoices').getFullList({
    filter: 'status = "paid"',
  });

  const customers = await pb.collection('customers').getFullList();
  const intakeSubmissions = await pb.collection('intake_submissions').getFullList();
  const projects = await pb.collection('projects').getFullList();

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const averageProjectPrice = invoices.length > 0 ? totalRevenue / invoices.length : 0;
  const conversionRate = intakeSubmissions.length > 0 ? (customers.length / intakeSubmissions.length) * 100 : 0;

  let averageProjectDuration = 0;
  const completedProjects = projects.filter(p => p.status === 'launched');
  if (completedProjects.length > 0) {
    const totalDays = completedProjects.reduce((sum, p) => {
      const created = new Date(p.created);
      const updated = new Date(p.updated);
      return sum + Math.floor((updated - created) / (1000 * 60 * 60 * 24));
    }, 0);
    averageProjectDuration = totalDays / completedProjects.length;
  }

  const ratings = customers.filter(c => c.satisfaction_rating).map(c => c.satisfaction_rating);
  const customerSatisfaction = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  res.json({
    total_revenue: parseFloat(totalRevenue.toFixed(2)),
    average_project_price: parseFloat(averageProjectPrice.toFixed(2)),
    conversion_rate: parseFloat(conversionRate.toFixed(2)),
    average_project_duration: parseFloat(averageProjectDuration.toFixed(2)),
    customer_satisfaction: parseFloat(customerSatisfaction.toFixed(2)),
  });
});

// GET /api/analytics/revenue
router.get('/revenue', async (req, res) => {
  const { period = '30days', start_date, end_date } = req.query;

  let startDate, endDate;

  if (period === 'custom' && start_date && end_date) {
    startDate = new Date(start_date);
    endDate = new Date(end_date);
  } else {
    endDate = new Date();
    startDate = new Date();

    switch (period) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '90days':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }
  }

  const invoices = await pb.collection('invoices').getFullList({
    filter: `created >= "${startDate.toISOString()}" && created <= "${endDate.toISOString()}" && status = "paid"`,
  });

  const monthlyData = {};

  invoices.forEach(inv => {
    const date = new Date(inv.created);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthKey, revenue: 0, invoice_count: 0 };
    }

    monthlyData[monthKey].revenue += inv.amount || 0;
    monthlyData[monthKey].invoice_count += 1;
  });

  const result = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(item => ({
      month: item.month,
      revenue: parseFloat(item.revenue.toFixed(2)),
      invoice_count: item.invoice_count,
    }));

  res.json(result);
});

// GET /api/analytics/customers
router.get('/customers', async (req, res) => {
  const customers = await pb.collection('customers').getFullList();

  const byPackage = { Starter: 0, Professional: 0, Premium: 0 };
  const byNiche = {};
  let activeCount = 0;
  let inactiveCount = 0;

  customers.forEach(c => {
    if (Object.hasOwn(byPackage, c.package)) {
      byPackage[c.package]++;
    }

    if (c.niche) {
      byNiche[c.niche] = (byNiche[c.niche] || 0) + 1;
    }

    if (c.status === 'active') {
      activeCount++;
    } else {
      inactiveCount++;
    }
  });

  res.json({
    by_package: byPackage,
    by_niche: byNiche,
    total_count: customers.length,
    active_count: activeCount,
    inactive_count: inactiveCount,
  });
});

// GET /api/analytics/projects
router.get('/projects', async (req, res) => {
  const projects = await pb.collection('projects').getFullList();
  const customers = await pb.collection('customers').getFullList();

  const byStatus = {};
  const averageDurationByPackage = {};
  let completedCount = 0;
  let inProgressCount = 0;

  projects.forEach(p => {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;

    if (p.status === 'launched') {
      completedCount++;
    } else if (p.status === 'in_progress') {
      inProgressCount++;
    }
  });

  customers.forEach(c => {
    const customerProjects = projects.filter(p => p.customer_id === c.id && p.status === 'launched');
    if (customerProjects.length > 0) {
      const totalDays = customerProjects.reduce((sum, p) => {
        const created = new Date(p.created);
        const updated = new Date(p.updated);
        return sum + Math.floor((updated - created) / (1000 * 60 * 60 * 24));
      }, 0);
      averageDurationByPackage[c.package] = parseFloat((totalDays / customerProjects.length).toFixed(2));
    }
  });

  res.json({
    by_status: byStatus,
    average_duration_by_package: averageDurationByPackage,
    total_projects: projects.length,
    completed_projects: completedCount,
    in_progress_projects: inProgressCount,
  });
});

export default router;