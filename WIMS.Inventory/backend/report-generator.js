/**
 * Report Generator Server Script
 * 
 * Simple Node.js script to generate report downloads in different formats
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve main app

// Create directories if they don't exist
const invoicesDir = path.join(__dirname, 'invoices');
const reportsDir = path.join(__dirname, 'reports');

if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir, { recursive: true });
}

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Serve invoice PDFs and reports
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use('/reports', express.static(path.join(__dirname, 'reports')));

// Routes
app.get('/', (req, res) => {
  res.send('Report Generator API is running');
});

// Generate PDF Report
app.post('/api/reports/pdf', (req, res) => {
  const { reportType, dateRange, startDate, endDate } = req.body;
  
  // Log the request
  console.log(`Generating PDF report: ${reportType}, Range: ${dateRange}, From: ${startDate}, To: ${endDate}`);
  
  // Simulate processing time
  setTimeout(() => {
    // In a real application, this would use a library like PDFKit to generate a PDF
    res.json({
      success: true,
      message: 'PDF Report generated successfully',
      downloadUrl: `/reports/${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`
    });
  }, 2000);
});

// Generate Excel Report
app.post('/api/reports/excel', (req, res) => {
  const { reportType, dateRange, startDate, endDate } = req.body;
  
  // Log the request
  console.log(`Generating Excel report: ${reportType}, Range: ${dateRange}, From: ${startDate}, To: ${endDate}`);
  
  // Simulate processing time
  setTimeout(() => {
    // In a real application, this would use a library like exceljs to generate an Excel file
    res.json({
      success: true,
      message: 'Excel Report generated successfully',
      downloadUrl: `/reports/${reportType}_${new Date().toISOString().slice(0, 10)}.xlsx`
    });
  }, 1500);
});

// Generate CSV Report
app.post('/api/reports/csv', (req, res) => {
  const { reportType, dateRange, startDate, endDate } = req.body;
  
  // Log the request
  console.log(`Generating CSV report: ${reportType}, Range: ${dateRange}, From: ${startDate}, To: ${endDate}`);
  
  // Simulate processing time
  setTimeout(() => {
    // In a real application, this would generate a CSV file
    res.json({
      success: true,
      message: 'CSV Report generated successfully',
      downloadUrl: `/reports/${reportType}_${new Date().toISOString().slice(0, 10)}.csv`
    });
  }, 1000);
});

// Get Report Data
app.get('/api/reports/data', (req, res) => {
  const { reportType, dateRange, startDate, endDate } = req.query;
  
  // Log the request
  console.log(`Fetching report data: ${reportType}, Range: ${dateRange}, From: ${startDate}, To: ${endDate}`);
  
  // In a real application, this would fetch data from a database
  // For demo, we'll return sample data
  const sampleData = getSampleReportData(reportType);
  
  res.json({
    success: true,
    data: sampleData
  });
});

// Generate Invoice PDF
app.post('/api/invoice/generate-pdf', (req, res) => {
  const invoiceData = req.body;
  
  // Log the request
  console.log(`Generating PDF for invoice: ${invoiceData.id || invoiceData.invoiceNumber}`);
  
  // Generate a unique invoice ID if one doesn't exist
  const invoiceId = invoiceData.id || invoiceData.invoiceNumber || `INV-${Date.now()}`;
  
  // Create directory if it doesn't exist
  const invoicesDir = path.join(__dirname, 'invoices');
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }
  
  // Generate PDF content immediately
  const pdfContent = generatePdfContent(invoiceData);
  
  // Save the HTML to a file with PDF extension (just for demo)
  const pdfFilename = `${invoiceId}.pdf`;
  const pdfPath = path.join(invoicesDir, pdfFilename);
  
  fs.writeFileSync(pdfPath, pdfContent);
  
  // Set headers for inline display
  const downloadUrl = `/invoices/${pdfFilename}`;
  
  // Return success response immediately with the data needed for instant viewing
  res.json({
    success: true,
    message: 'Invoice PDF generated successfully',
    downloadUrl: downloadUrl,
    invoiceId: invoiceId,
    pdfContent: pdfContent, // Include the content for instant rendering
    viewMode: 'inline', // Indicate this should be viewed inline
    invoiceData: {
      ...invoiceData,
      id: invoiceId,
      invoiceNumber: invoiceId,
      generatedAt: new Date().toISOString(),
      status: 'processed'
    }
  });
});

// Helper function to generate PDF content
function generatePdfContent(invoiceData) {
  // Simple HTML template for the invoice
  // In a real app, you'd use a PDF generation library
  const logoHtml = invoiceData.logoData 
    ? `<img src="${invoiceData.logoData}" alt="Company Logo" style="max-height: 80px; max-width: 200px;">` 
    : `<h2 style="color: #4299e1;">WIMS SYSTEM</h2>`;
  
  const itemsHtml = invoiceData.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.description}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.discount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceData.invoiceNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #2d3748; }
      .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      .invoice-header { display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #e2e8f0; }
      .invoice-info { text-align: right; }
      .invoice-body { padding: 20px; }
      .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
      .from, .to { width: 45%; }
      .from h3, .to h3 { margin-top: 0; color: #4a5568; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      th { background-color: #f8fafc; padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0; }
      .summary { margin-left: auto; width: 300px; }
      .summary-row { display: flex; justify-content: space-between; padding: 5px 0; }
      .grand-total { font-weight: bold; border-top: 2px solid #e2e8f0; padding-top: 5px; margin-top: 5px; }
      .notes { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
      .notes h3 { margin-top: 0; color: #4a5568; }
      .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #718096; }
      .handler { text-align: right; margin-top: 40px; font-style: italic; }
      .status-banner { text-align: center; padding: 10px; margin: 20px 0; font-weight: bold; border-radius: 4px; }
      .status-paid { background-color: #c6f6d5; color: #22543d; }
      .status-unpaid { background-color: #fed7d7; color: #822727; }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="invoice-header">
        <div class="logo">
          ${logoHtml}
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
          <p><strong>Date:</strong> ${new Date(invoiceData.issueDate).toLocaleDateString('en-IN')}</p>
          ${invoiceData.dueDate ? `<p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString('en-IN')}</p>` : ''}
        </div>
      </div>
      
      <div class="invoice-body">
        <div class="parties">
          <div class="from">
            <h3>From</h3>
            <p><strong>WIMS System</strong></p>
            <p>123 Business Avenue</p>
            <p>Mumbai, Maharashtra 400001</p>
            <p>India</p>
            <p>Email: info@wimssystem.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          
          <div class="to">
            <h3>To</h3>
            <p><strong>${invoiceData.customerName}</strong></p>
            <p>${invoiceData.customerAddress || 'No address provided'}</p>
            ${invoiceData.customerEmail ? `<p>Email: ${invoiceData.customerEmail}</p>` : ''}
            ${invoiceData.customerPhone ? `<p>Phone: ${invoiceData.customerPhone}</p>` : ''}
          </div>
        </div>
        
        <div class="status-banner status-${invoiceData.status || 'paid'}">
          Status: ${invoiceData.status ? invoiceData.status.toUpperCase() : 'PAID'}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Discount</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹${invoiceData.subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <div class="summary-row">
            <span>Tax (${invoiceData.taxRate || 18}%):</span>
            <span>₹${invoiceData.tax.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          <div class="summary-row">
            <span>Additional Discount:</span>
            <span>₹${invoiceData.additionalDiscount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          ${invoiceData.shipping ? `
          <div class="summary-row">
            <span>Shipping:</span>
            <span>₹${invoiceData.shipping.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          ` : ''}
          <div class="summary-row grand-total">
            <span>Grand Total:</span>
            <span>₹${invoiceData.grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
        
        <div class="notes">
          <h3>Notes</h3>
          <p>${invoiceData.notes || 'Thank you for your business!'}</p>
        </div>
        
        <div class="handler">
          <p>Handled by: ${invoiceData.handler || 'Ekta Sandhu'}</p>
        </div>
      </div>
      
      <div class="footer">
        <p>This is a computer-generated invoice and requires no signature.</p>
        <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Helper function to get sample report data
function getSampleReportData(reportType) {
  switch(reportType) {
    case 'sales':
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [345780, 329450, 408920, 387650, 452100, 516780]
          }
        ]
      };
    case 'inventory':
      return {
        labels: ['Electronics', 'Clothing', 'Furniture', 'Accessories', 'Others'],
        datasets: [
          {
            label: 'Stock Value',
            data: [2707500, 243000, 101750, 50400, 28000]
          }
        ]
      };
    case 'purchases':
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Purchases',
            data: [258950, 312450, 287650, 264300, 298700, 310500]
          }
        ]
      };
    default:
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Sales',
            data: [345780, 329450, 408920, 387650, 452100, 516780]
          },
          {
            label: 'Purchases',
            data: [258950, 312450, 287650, 264300, 298700, 310500]
          }
        ]
      };
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Report Generator API is running on port ${PORT}`);
  console.log(`Access the frontend at http://localhost:${PORT}`);
}); 