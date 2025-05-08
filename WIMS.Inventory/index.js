/**
 * WIMS.Inventory - Warehouse Inventory Management System
 * Main entry point for the application
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

// Import backend services
const reportGenerator = require('./backend/report-generator');
const pdfGenerator = require('./backend/pdf-generator');

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve HTML templates
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.get('/:page.html', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, 'templates', `${page}.html`));
});

// Set up the report and invoice directories
app.use('/reports', express.static(path.join(__dirname, 'reports')));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Start the server
app.listen(PORT, HOSTNAME, () => {
  console.log(`WIMS.Inventory system is running at http://${HOSTNAME}:${PORT}`);
  console.log(`Access the application at http://${HOSTNAME}:${PORT}`);
}); 