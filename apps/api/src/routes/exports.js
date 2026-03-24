import express from 'express';
import pb from '../utils/pocketbase.js';
import { generateCSV, sendCSVResponse } from '../utils/csv.js';

const router = express.Router();

// POST /api/exports/customers
router.post('/customers', async (req, res) => {
  const { format = 'csv', filters } = req.query;

  let filterQuery = '';
  if (filters) {
    const filterObj = JSON.parse(filters);
    if (filterObj.status) filterQuery += `status = "${filterObj.status}" && `;
    if (filterObj.package) filterQuery += `package = "${filterObj.package}" && `;
  }

  const customers = await pb.collection('customers').getFullList({
    filter: filterQuery ? filterQuery.slice(0, -4) : '',
  });

  if (format === 'json') {
    return res.json(customers);
  }

  const csvData = customers.map(c => ({
    name: c.name || '',
    email: c.email || '',
    company: c.company || '',
    phone: c.phone || '',
    package: c.package || '',
    status: c.status || '',
    created_date: new Date(c.created).toISOString().split('T')[0],
  }));

  const csv = generateCSV(csvData, ['name', 'email', 'company', 'phone', 'package', 'status', 'created_date']);
  sendCSVResponse(res, 'customers.csv', csv);
});

// POST /api/exports/invoices
router.post('/invoices', async (req, res) => {
  const { format = 'csv', status_filter } = req.query;

  let filterQuery = '';
  if (status_filter) {
    filterQuery = `status = "${status_filter}"`;
  }

  const invoices = await pb.collection('invoices').getFullList({
    filter: filterQuery,
    expand: 'customer_id',
  });

  if (format === 'json') {
    return res.json(invoices);
  }

  const csvData = invoices.map(inv => ({
    invoice_number: inv.invoice_number || '',
    customer: inv.expand?.customer_id?.name || '',
    amount: inv.amount || 0,
    status: inv.status || '',
    due_date: inv.due_date ? new Date(inv.due_date).toISOString().split('T')[0] : '',
    created_date: new Date(inv.created).toISOString().split('T')[0],
  }));

  const csv = generateCSV(csvData, ['invoice_number', 'customer', 'amount', 'status', 'due_date', 'created_date']);
  sendCSVResponse(res, 'invoices.csv', csv);
});

// POST /api/exports/projects
router.post('/projects', async (req, res) => {
  const { format = 'csv' } = req.query;

  const projects = await pb.collection('projects').getFullList({
    expand: 'customer_id',
  });

  if (format === 'json') {
    return res.json(projects);
  }

  const csvData = projects.map(p => ({
    project_id: p.id || '',
    customer: p.expand?.customer_id?.name || '',
    niche: p.niche || '',
    package: p.package || '',
    status: p.status || '',
    created_date: new Date(p.created).toISOString().split('T')[0],
    updated_date: new Date(p.updated).toISOString().split('T')[0],
  }));

  const csv = generateCSV(csvData, ['project_id', 'customer', 'niche', 'package', 'status', 'created_date', 'updated_date']);
  sendCSVResponse(res, 'projects.csv', csv);
});

export default router;