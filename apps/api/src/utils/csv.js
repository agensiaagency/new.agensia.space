import { stringify } from 'csv-stringify/sync';

export const generateCSV = (data, columns) => {
  return stringify(data, {
    header: true,
    columns: columns,
  });
};

export const sendCSVResponse = (res, filename, csvContent) => {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvContent);
};

export default { generateCSV, sendCSVResponse };