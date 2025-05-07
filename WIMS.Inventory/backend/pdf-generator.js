const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for image data
app.use(express.static(path.join(__dirname, '../')));

// PDF Generation Endpoint
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const invoiceData = req.body;
        
        if (!invoiceData) {
            return res.status(400).json({ error: 'No invoice data provided' });
        }
        
        // Create a PDF document
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoiceNumber}.pdf`);
        
        // Pipe the PDF document to the response
        doc.pipe(res);
        
        // Generate PDF content
        generateInvoicePDF(doc, invoiceData);
        
        // Finalize the PDF and end the response
        doc.end();
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
});

// Function to generate the PDF content
function generateInvoicePDF(doc, data) {
    // Add company logo if provided
    if (data.logoData) {
        try {
            // Extract base64 data (remove the data:image/xxx;base64, part)
            const base64Data = data.logoData.split(';base64,').pop();
            const logoBuffer = Buffer.from(base64Data, 'base64');
            
            // Add the logo to the PDF (positioned at the top left)
            doc.image(logoBuffer, 50, 50, { width: 150 });
        } catch (error) {
            console.error('Error adding logo to PDF:', error);
            // Continue without the logo if there's an error
        }
    }
    
    // Add invoice header information (positioned at the top right)
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('INVOICE', 400, 50, { align: 'right' });
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Invoice #: ${data.invoiceNumber}`, 400, 85, { align: 'right' })
       .text(`Date: ${data.issueDate}`, 400, 100, { align: 'right' })
       .text(`Due Date: ${data.dueDate || 'N/A'}`, 400, 115, { align: 'right' });
    
    // Add a horizontal line
    doc.moveTo(50, 150)
       .lineTo(550, 150)
       .stroke();
    
    // Add from and to information
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('From:', 50, 170)
       .font('Helvetica')
       .fontSize(10)
       .text('Your Company Name', 50, 185)
       .text('Your Company Address', 50, 200);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('To:', 300, 170)
       .font('Helvetica')
       .fontSize(10)
       .text(data.customerName || 'N/A', 300, 185)
       .text(data.customerAddress || '', 300, 200)
       .text(data.customerEmail || '', 300, 215)
       .text(data.customerPhone || '', 300, 230);
    
    // Add items table header
    const tableTop = 270;
    const tableHeaders = ['Description', 'Quantity', 'Rate', 'Discount', 'Amount'];
    const tableColumnWidths = [250, 60, 80, 80, 80];
    let currentPosition = 50;
    
    doc.font('Helvetica-Bold')
       .fontSize(10);
    
    tableHeaders.forEach((header, i) => {
        doc.text(header, currentPosition, tableTop);
        currentPosition += tableColumnWidths[i];
    });
    
    // Add a line below the headers
    doc.moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();
    
    // Add items
    let yPosition = tableTop + 25;
    
    if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
            // Check if we need to add a new page
            if (yPosition > 700) {
                doc.addPage();
                yPosition = 50;
            }
            
            currentPosition = 50;
            
            doc.font('Helvetica')
               .fontSize(9)
               .text(item.description || '', currentPosition, yPosition, { width: 240, ellipsis: true });
            
            currentPosition += tableColumnWidths[0];
            doc.text(item.quantity || '', currentPosition, yPosition, { width: 50, align: 'center' });
            
            currentPosition += tableColumnWidths[1];
            doc.text(formatCurrency(item.rate || 0, data.currency), currentPosition, yPosition, { width: 70, align: 'right' });
            
            currentPosition += tableColumnWidths[2];
            doc.text(formatCurrency(item.discount || 0, data.currency), currentPosition, yPosition, { width: 70, align: 'right' });
            
            currentPosition += tableColumnWidths[3];
            doc.text(formatCurrency(item.amount || 0, data.currency), currentPosition, yPosition, { width: 70, align: 'right' });
            
            yPosition += 20;
        });
    } else {
        doc.font('Helvetica')
           .fontSize(10)
           .text('No items', 50, yPosition);
        
        yPosition += 20;
    }
    
    // Add a line below the items
    doc.moveTo(50, yPosition)
       .lineTo(550, yPosition)
       .stroke();
    
    yPosition += 20;
    
    // Add summary
    const summaryX = 400;
    
    doc.font('Helvetica')
       .fontSize(10)
       .text('Subtotal:', summaryX, yPosition, { width: 70 })
       .text(formatCurrency(data.subtotal || 0, data.currency), 550, yPosition, { align: 'right' });
    
    yPosition += 15;
    
    doc.text('Tax:', summaryX, yPosition, { width: 70 })
       .text(formatCurrency(data.tax || 0, data.currency), 550, yPosition, { align: 'right' });
    
    yPosition += 15;
    
    if (data.additionalDiscount) {
        doc.text('Additional Discount:', summaryX, yPosition, { width: 120 })
           .text(formatCurrency(data.additionalDiscount || 0, data.currency), 550, yPosition, { align: 'right' });
        
        yPosition += 15;
    }
    
    if (data.shipping) {
        doc.text('Shipping:', summaryX, yPosition, { width: 70 })
           .text(formatCurrency(data.shipping || 0, data.currency), 550, yPosition, { align: 'right' });
        
        yPosition += 15;
    }
    
    // Add a line before the grand total
    doc.moveTo(summaryX, yPosition)
       .lineTo(550, yPosition)
       .stroke();
    
    yPosition += 10;
    
    // Add grand total
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .text('Grand Total:', summaryX, yPosition, { width: 100 })
       .text(formatCurrency(data.grandTotal || 0, data.currency), 550, yPosition, { align: 'right' });
    
    yPosition += 40;
    
    // Add notes if available
    if (data.notes) {
        doc.font('Helvetica-Bold')
           .fontSize(11)
           .text('Notes:', 50, yPosition);
        
        yPosition += 15;
        
        doc.font('Helvetica')
           .fontSize(10)
           .text(data.notes, 50, yPosition, { width: 500 });
    }
    
    // Add footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        
        // Add page number at the bottom
        doc.font('Helvetica')
           .fontSize(8)
           .text(
               `Page ${i + 1} of ${pageCount}`,
               50,
               doc.page.height - 50,
               { align: 'center', width: doc.page.width - 100 }
           );
        
        // Add a thank you message
        if (i === pageCount - 1) {
            doc.font('Helvetica')
               .fontSize(10)
               .text(
                   'Thank you for your business!',
                   50,
                   doc.page.height - 70,
                   { align: 'center', width: doc.page.width - 100 }
               );
        }
    }
}

// Helper function to format currency
function formatCurrency(amount, currencyCode = 'INR') {
    const currencySymbols = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
    };
    
    const symbol = currencySymbols[currencyCode] || currencySymbols['INR'];
    
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
}

// Start the server
app.listen(PORT, () => {
    console.log(`PDF Generator server running on port ${PORT}`);
});

module.exports = app; 