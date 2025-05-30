// Add to the top of the file for better PDF handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the invoice management system
    initInvoiceSystem();
    
    // Add click event listener for all PDF generate buttons
    const pdfButtons = document.querySelectorAll('#preview-generate-pdf-btn, #generate-invoice-pdf-btn, .generate-pdf-btn, .action-btn.pdf, .card-btn.pdf');
    pdfButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const id = this.getAttribute('data-id');
            if (id) {
                // This is for existing invoice PDFs
                generatePDF(id);
            } else {
                // This is for the new invoice form
                generateInvoicePDF();
            }
            e.preventDefault();
        });
    });
});

function initInvoiceSystem() {
    // Initialize view toggles
    initViewToggles();
    
    // Load sample data
    loadSampleData();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize invoice creation
    initInvoiceCreation();
    
    // Add toast notifications
    addToastNotifications();
}

function initViewToggles() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const viewContainers = document.querySelectorAll('.view-container');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Toggle active class on buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Toggle active class on view containers
            viewContainers.forEach(container => {
                container.classList.remove('active');
                if (container.classList.contains(`${viewType}-view`)) {
                    container.classList.add('active');
                }
            });
        });
    });
}

function loadSampleData() {
    const tableBody = document.querySelector('.invoice-table tbody');
    const cardContainer = document.querySelector('.invoice-cards');
    const loadingSpinners = document.querySelectorAll('.loading-spinner');
    const emptyStates = document.querySelectorAll('.empty-state');
    
    // Sample data
    const invoices = [
        {
            id: "INV-2023-001",
            date: "2023-11-15",
            type: "sales",
            customer: "Vikram Sharma",
            products: [
                { name: "4K Smart LED Television", quantity: 1, price: 34999, total: 34999 },
                { name: "Wireless Bluetooth Headphones", quantity: 2, price: 2499, total: 4998 }
            ],
            subtotal: 39997,
            tax: 7199.46,
            discount: 2000,
            grandTotal: 45196.46,
            paymentMode: "Card",
            status: "paid",
            dueDate: "",
            handler: "Ekta Sandhu"
        },
        {
            id: "INV-2023-002",
            date: "2023-11-10",
            type: "sales",
            customer: "Priya Patel",
            products: [
                { name: "Men's Formal Cotton Shirt", quantity: 3, price: 999, total: 2997 }
            ],
            subtotal: 2997,
            tax: 539.46,
            discount: 0,
            grandTotal: 3536.46,
            paymentMode: "UPI",
            status: "paid",
            dueDate: "",
            handler: "Ekta Sandhu"
        },
        {
            id: "BILL-2023-001",
            date: "2023-11-05",
            type: "purchase",
            supplier: "VisualTech Electronics",
            products: [
                { name: "4K Smart LED Television", quantity: 5, price: 28500, total: 142500 },
                { name: "Wireless Bluetooth Headphones", quantity: 10, price: 1800, total: 18000 }
            ],
            subtotal: 160500,
            tax: 28890,
            discount: 5000,
            grandTotal: 184390,
            paymentMode: "Bank Transfer",
            status: "paid",
            dueDate: "",
            handler: "Ekta Sandhu"
        },
        {
            id: "BILL-2023-002",
            date: "2023-11-02",
            type: "purchase",
            supplier: "FashionStyle Apparels",
            products: [
                { name: "Men's Formal Cotton Shirt", quantity: 50, price: 550, total: 27500 }
            ],
            subtotal: 27500,
            tax: 4950,
            discount: 2750,
            grandTotal: 29700,
            paymentMode: "Credit",
            status: "unpaid",
            dueDate: "2023-12-02",
            handler: "Ekta Sandhu"
        },
        {
            id: "INV-2023-003",
            date: "2023-10-28",
            type: "sales",
            customer: "GreenTech Solutions",
            products: [
                { name: "Ergonomic Office Chair", quantity: 5, price: 5999, total: 29995 },
                { name: "Wooden Coffee Table", quantity: 2, price: 7499, total: 14998 }
            ],
            subtotal: 44993,
            tax: 8098.74,
            discount: 4000,
            grandTotal: 49091.74,
            paymentMode: "Credit",
            status: "partial",
            dueDate: "2023-11-28",
            handler: "Ekta Sandhu"
        }
    ];
    
    // Simulate loading
    setTimeout(() => {
        // Hide loading spinners
        loadingSpinners.forEach(spinner => {
            spinner.style.display = 'none';
        });
        
        if (invoices.length > 0) {
            // Render table rows
            tableBody.innerHTML = generateTableRows(invoices);
            
            // Render cards
            cardContainer.innerHTML = generateCards(invoices);
            
            // Initialize expandable rows
            initExpandableRows();
            
            // Initialize actions
            initActionButtons();
        } else {
            // Show empty state
            emptyStates.forEach(state => {
                state.style.display = 'flex';
            });
        }
    }, 1000);
}

function generateTableRows(invoices) {
    let html = '';
    
    invoices.forEach(invoice => {
        // Format currency
        const formattedSubtotal = formatCurrency(invoice.subtotal);
        const formattedTax = formatCurrency(invoice.tax);
        const formattedDiscount = formatCurrency(invoice.discount);
        const formattedGrandTotal = formatCurrency(invoice.grandTotal);
        
        // Format date
        const formattedDate = formatDate(invoice.date);
        
        // Create product summary
        const productSummary = invoice.products.map(p => p.name).join(', ');
        
        html += `
            <tr class="expandable-row" data-id="${invoice.id}">
                <td>${invoice.id}</td>
                <td>${formattedDate}</td>
                <td><span class="invoice-type ${invoice.type}">${invoice.type === 'sales' ? 'Sales' : 'Purchase'}</span></td>
                <td>${invoice.type === 'sales' ? invoice.customer : invoice.supplier}</td>
                <td>${productSummary}</td>
                <td>${formattedSubtotal}</td>
                <td>${formattedTax}</td>
                <td>${formattedDiscount}</td>
                <td>${formattedGrandTotal}</td>
                <td>${invoice.paymentMode}</td>
                <td><span class="payment-status ${invoice.status}">${capitalizeFirstLetter(invoice.status)}</span></td>
                <td>${invoice.dueDate ? formatDate(invoice.dueDate) : '-'}</td>
                <td>${invoice.handler}</td>
                <td class="actions">
                    <button class="action-btn view" data-id="${invoice.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" data-id="${invoice.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" data-id="${invoice.id}" title="Delete"><i class="fas fa-trash"></i></button>
                    <button class="action-btn pdf" data-id="${invoice.id}" title="Generate PDF"><i class="fas fa-file-pdf"></i></button>
                </td>
            </tr>
            <tr class="expansion-panel" data-id="${invoice.id}">
                <td colspan="14">
                    <div class="expansion-content">
                        <h3>Products</h3>
                        <table class="products-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${generateProductRows(invoice.products)}
                            </tbody>
                        </table>
                        
                        <div class="invoice-summary">
                            <table class="summary-table">
                                <tr>
                                    <td>Subtotal:</td>
                                    <td>${formattedSubtotal}</td>
                                </tr>
                                <tr>
                                    <td>Tax:</td>
                                    <td>${formattedTax}</td>
                                </tr>
                                <tr>
                                    <td>Discount:</td>
                                    <td>- ${formattedDiscount}</td>
                                </tr>
                                <tr class="grand-total">
                                    <td>Grand Total:</td>
                                    <td>${formattedGrandTotal}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });
    
    return html;
}

function generateProductRows(products) {
    let html = '';
    
    products.forEach(product => {
        const formattedPrice = formatCurrency(product.price);
        const formattedTotal = formatCurrency(product.total);
        
        html += `
            <tr>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${formattedPrice}</td>
                <td>${formattedTotal}</td>
            </tr>
        `;
    });
    
    return html;
}

function generateCards(invoices) {
    let html = '';
    
    invoices.forEach(invoice => {
        // Format currency
        const formattedSubtotal = formatCurrency(invoice.subtotal);
        const formattedTax = formatCurrency(invoice.tax);
        const formattedDiscount = formatCurrency(invoice.discount);
        const formattedGrandTotal = formatCurrency(invoice.grandTotal);
        
        // Format date
        const formattedDate = formatDate(invoice.date);
        
        // Create products HTML
        let productsHtml = '';
        invoice.products.forEach(product => {
            productsHtml += `
                <div class="product-item">
                    <div class="product-name">${product.name}</div>
                    <div class="product-details">${product.quantity} x ${formatCurrency(product.price)} = ${formatCurrency(product.total)}</div>
                </div>
            `;
        });
        
        html += `
            <div class="invoice-card" data-id="${invoice.id}">
                <div class="card-header">
                    <div class="invoice-info">
                        <h3>${invoice.id}</h3>
                        <div class="invoice-date">${formattedDate}</div>
                    </div>
                    <span class="invoice-type ${invoice.type}">${invoice.type === 'sales' ? 'Sales' : 'Purchase'}</span>
                </div>
                
                <div class="card-body">
                    <div class="customer-info">
                        <span class="info-label">${invoice.type === 'sales' ? 'Customer' : 'Supplier'}</span>
                        <span class="info-value">${invoice.type === 'sales' ? invoice.customer : invoice.supplier}</span>
                    </div>
                    
                    <div class="products-info">
                        <span class="info-label">Products</span>
                        <div class="info-value">
                            ${productsHtml}
                        </div>
                    </div>
                    
                    <div class="payment-info">
                        <span class="info-label">Payment Details</span>
                        <div class="info-value">
                            <div>${invoice.paymentMode} - <span class="payment-status ${invoice.status}">${capitalizeFirstLetter(invoice.status)}</span></div>
                            ${invoice.dueDate ? `<div>Due Date: ${formatDate(invoice.dueDate)}</div>` : ''}
                            <div>Handler: ${invoice.handler}</div>
                        </div>
                    </div>
                    
                    <div class="invoice-totals">
                        <div class="total-row">
                            <span class="total-label">Subtotal</span>
                            <span class="total-value">${formattedSubtotal}</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Tax</span>
                            <span class="total-value">${formattedTax}</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Discount</span>
                            <span class="total-value">- ${formattedDiscount}</span>
                        </div>
                        <div class="total-row grand-total">
                            <span class="total-label">Grand Total</span>
                            <span class="total-value">${formattedGrandTotal}</span>
                        </div>
                    </div>
                </div>
                
                <div class="card-footer">
                    <button class="card-btn view" data-id="${invoice.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="card-btn edit" data-id="${invoice.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="card-btn delete" data-id="${invoice.id}"><i class="fas fa-trash"></i> Delete</button>
                    <button class="card-btn pdf" data-id="${invoice.id}"><i class="fas fa-file-pdf"></i> PDF</button>
                </div>
            </div>
        `;
    });
    
    return html;
}

function initExpandableRows() {
    const expandableRows = document.querySelectorAll('.expandable-row');
    
    expandableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Don't expand if clicked on an action button
            if (e.target.closest('.action-btn')) {
                return;
            }
            
            const id = this.getAttribute('data-id');
            const expansionPanel = document.querySelector(`.expansion-panel[data-id="${id}"]`);
            
            this.classList.toggle('expanded');
            
            if (expansionPanel.classList.contains('visible')) {
                // Hide the panel
                expansionPanel.classList.remove('visible');
            } else {
                // Show the panel
                expansionPanel.classList.add('visible');
            }
        });
    });
}

function initActionButtons() {
    // View buttons
    const viewButtons = document.querySelectorAll('.action-btn.view, .card-btn.view');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent row expansion
            const id = this.getAttribute('data-id');
            openInvoiceModal(id);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.action-btn.edit, .card-btn.edit');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent row expansion
            const id = this.getAttribute('data-id');
            editInvoice(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.action-btn.delete, .card-btn.delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent row expansion
            const id = this.getAttribute('data-id');
            deleteInvoice(id);
        });
    });
    
    // Generate PDF buttons
    const pdfButtons = document.querySelectorAll('.action-btn.pdf, .card-btn.pdf');
    pdfButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent row expansion
            const id = this.getAttribute('data-id');
            generatePDF(id);
        });
    });
}

function initEventListeners() {
    // Close modal buttons
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const closeBtnFooter = document.querySelector('.close-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (closeBtnFooter) {
        closeBtnFooter.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Generate PDF button in modal
    const generatePdfBtnModal = document.querySelector('.generate-pdf-btn');
    if (generatePdfBtnModal) {
        generatePdfBtnModal.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            generatePDF(id);
        });
    }
    
    // Filter functionality
    const filters = document.querySelectorAll('#invoice-type-filter, #payment-status-filter');
    filters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    const dateFilters = document.querySelectorAll('#date-from, #date-to');
    dateFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    const searchInput = document.querySelector('#invoice-search');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Create Invoice button
    const createInvoiceBtn = document.querySelector('.create-invoice-btn');
    if (createInvoiceBtn) {
        createInvoiceBtn.addEventListener('click', openCreateInvoiceModal);
    }
}

function openInvoiceModal(id) {
    // In a real application, you would fetch the invoice details from the server
    // For this demo, we'll just use a placeholder
    
    const modal = document.querySelector('.invoice-detail-modal');
    const modalBody = modal.querySelector('.modal-body');
    const generatePdfBtn = modal.querySelector('.generate-pdf-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Set the invoice ID to the generate PDF button
    if (generatePdfBtn) {
        generatePdfBtn.setAttribute('data-id', id);
    }
    
    // Sample invoice details HTML (replace with actual data in a real app)
    modalBody.innerHTML = `
        <div class="invoice-details">
            <div class="invoice-detail-section">
                <div class="detail-section-header">Basic Information</div>
                <div class="detail-section-body">
                    <div class="detail-row">
                        <div class="detail-label">Invoice Number:</div>
                        <div class="detail-value">${id}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div class="detail-value">November 15, 2023</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Type:</div>
                        <div class="detail-value">Sales Invoice</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Customer:</div>
                        <div class="detail-value">Vikram Sharma</div>
                    </div>
                </div>
            </div>
            
            <div class="invoice-detail-section">
                <div class="detail-section-header">Products</div>
                <div class="detail-section-body">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4K Smart LED Television</td>
                                <td>1</td>
                                <td>₹34,999</td>
                                <td>₹34,999</td>
                            </tr>
                            <tr>
                                <td>Wireless Bluetooth Headphones</td>
                                <td>2</td>
                                <td>₹2,499</td>
                                <td>₹4,998</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="invoice-detail-section">
                <div class="detail-section-header">Payment Details</div>
                <div class="detail-section-body">
                    <div class="detail-row">
                        <div class="detail-label">Payment Mode:</div>
                        <div class="detail-value">Card</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value"><span class="payment-status paid">Paid</span></div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Handler:</div>
                        <div class="detail-value">Ekta Sandhu</div>
                    </div>
                </div>
            </div>
            
            <div class="invoice-detail-section">
                <div class="detail-section-header">Summary</div>
                <div class="detail-section-body">
                    <div class="invoice-summary">
                        <table class="summary-table">
                            <tr>
                                <td>Subtotal:</td>
                                <td>₹39,997</td>
                            </tr>
                            <tr>
                                <td>Tax:</td>
                                <td>₹7,199.46</td>
                            </tr>
                            <tr>
                                <td>Discount:</td>
                                <td>- ₹2,000</td>
                            </tr>
                            <tr class="grand-total">
                                <td>Grand Total:</td>
                                <td>₹45,196.46</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal and overlay
    modal.classList.add('open');
    modalOverlay.classList.add('active');
}

function closeModal() {
    const modal = document.querySelector('.invoice-detail-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    modal.classList.remove('open');
    modalOverlay.classList.remove('active');
}

function editInvoice(id) {
    // In a real application, you would open a form to edit the invoice
    alert(`Editing invoice ${id} - This would open an edit form in a real application`);
}

function deleteInvoice(id) {
    // In a real application, you would send a request to delete the invoice
    if (confirm(`Are you sure you want to delete invoice ${id}?`)) {
        alert(`Invoice ${id} deleted successfully!`);
    }
}

function generatePDF(id) {
    // Show generating toast
    showToast('pdf-generating');
    
    // Find the invoice data in our sample data
    // In a real application, you would fetch this from the server
    const invoices = [
        {
            id: "INV-2023-001",
            invoiceNumber: "INV-2023-001",
            issueDate: "2023-11-15",
            dueDate: "2023-11-30",
            customerName: "Vikram Sharma",
            customerAddress: "123 Main St, Mumbai",
            customerEmail: "vikram@example.com",
            customerPhone: "+91 98765 43210",
            items: [
                { description: "4K Smart LED Television", quantity: 1, rate: 34999, discount: 0, amount: 34999 },
                { description: "Wireless Bluetooth Headphones", quantity: 2, rate: 2499, discount: 0, amount: 4998 }
            ],
            subtotal: 39997,
            tax: 7199.46,
            taxRate: 18,
            additionalDiscount: 2000,
            shipping: 0,
            grandTotal: 45196.46,
            currency: "INR",
            notes: "Thank you for your business!",
            handler: "Ekta Sandhu" // Updated handler name
        }
    ];
    
    // Find the invoice with the matching ID
    const invoice = invoices.find(inv => inv.id === id) || invoices[0];
    
    // Create PDF using jsPDF
    try {
        // Initialize PDF
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set default font
        pdf.setFont("helvetica");
        
        // Add header
        pdf.setFontSize(22);
        pdf.setTextColor(44, 62, 80); // Dark text color
        pdf.text("INVOICE", 105, 20, { align: "center" });
        
        // Add invoice info
        pdf.setFontSize(10);
        pdf.setTextColor(52, 73, 94);
        pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 200, 20, { align: "right" });
        pdf.text(`Date: ${formatDate(invoice.issueDate)}`, 200, 25, { align: "right" });
        pdf.text(`Due Date: ${invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}`, 200, 30, { align: "right" });
        
        // Add company info (sender)
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("From:", 15, 40);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("Your Company Name", 15, 45);
        pdf.text("Your Company Address", 15, 50);
        
        // Add customer info (recipient)
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("To:", 120, 40);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(invoice.customerName, 120, 45);
        if (invoice.customerAddress) {
            const addressLines = pdf.splitTextToSize(invoice.customerAddress, 70);
            pdf.text(addressLines, 120, 50);
            let yPos = 50 + addressLines.length * 5;
            if (invoice.customerEmail) pdf.text(`Email: ${invoice.customerEmail}`, 120, yPos += 5);
            if (invoice.customerPhone) pdf.text(`Phone: ${invoice.customerPhone}`, 120, yPos += 5);
        } else {
            let yPos = 45;
            if (invoice.customerEmail) pdf.text(`Email: ${invoice.customerEmail}`, 120, yPos += 5);
            if (invoice.customerPhone) pdf.text(`Phone: ${invoice.customerPhone}`, 120, yPos += 5);
        }
        
        // Add items table
        const tableColumns = [
            { header: 'Item Description', dataKey: 'description' },
            { header: 'Quantity', dataKey: 'quantity' },
            { header: 'Rate', dataKey: 'rate' },
            { header: 'Discount', dataKey: 'discount' },
            { header: 'Amount', dataKey: 'amount' }
        ];
        
        const tableRows = invoice.items.map(item => ({
            description: item.description,
            quantity: item.quantity.toString(),
            rate: formatCurrency(item.rate).replace('₹', ''),
            discount: formatCurrency(item.discount).replace('₹', ''),
            amount: formatCurrency(item.amount).replace('₹', '')
        }));
        
        pdf.autoTable({
            startY: 70,
            head: [tableColumns.map(col => col.header)],
            body: tableRows,
            theme: 'grid',
            headStyles: {
                fillColor: [108, 92, 231],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 80 }, // Description
                1: { cellWidth: 20, halign: 'center' }, // Quantity
                2: { cellWidth: 25, halign: 'right' }, // Rate
                3: { cellWidth: 25, halign: 'right' }, // Discount
                4: { cellWidth: 30, halign: 'right' }  // Amount
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            didDrawPage: function(data) {
                // Add page number
                pdf.setFontSize(8);
                pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, 
                    pdf.internal.pageSize.width - 20, 
                    pdf.internal.pageSize.height - 10);
            }
        });
        
        // Add summary section
        const finalY = pdf.lastAutoTable.finalY + 10;
        
        // Summary table
        pdf.autoTable({
            startY: finalY,
            body: [
                ['Subtotal:', formatCurrency(invoice.subtotal).replace('₹', '')],
                [`Tax (${invoice.taxRate || 18}%):`, formatCurrency(invoice.tax).replace('₹', '')],
                ['Additional Discount:', formatCurrency(invoice.additionalDiscount).replace('₹', '')],
                ['Shipping:', formatCurrency(invoice.shipping || 0).replace('₹', '')],
                ['Grand Total:', formatCurrency(invoice.grandTotal).replace('₹', '')]
            ],
            theme: 'plain',
            columnStyles: {
                0: { cellWidth: 150, fontStyle: 'bold' },
                1: { cellWidth: 30, halign: 'right' }
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            margin: { left: 120 }
        });
        
        // Add notes section
        if (invoice.notes) {
            const finalY2 = pdf.lastAutoTable.finalY + 10;
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.text("Notes:", 15, finalY2);
            pdf.setFont("helvetica", "normal");
            
            const noteLines = pdf.splitTextToSize(invoice.notes, 180);
            pdf.text(noteLines, 15, finalY2 + 5);
        }
        
        // Add footer
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text("Thank you for your business!", 105, pdf.internal.pageSize.height - 10, { align: "center" });
        
        // Save and open PDF
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Hide generating toast and show success toast
        hideToast('pdf-generating');
        showToast('pdf-ready');
        
        // Open PDF in new tab
        window.open(pdfUrl, '_blank');
        
        // Mark the row as having a new download
        const row = document.querySelector(`.expandable-row[data-id="${id}"]`);
        if (row) {
            row.classList.add('new-download');
            setTimeout(() => {
                row.classList.remove('new-download');
            }, 10000);
        }
        
        // Hide success toast after 2 seconds
        setTimeout(() => {
            hideToast('pdf-ready');
        }, 2000);
        
    } catch (error) {
        console.error('Error creating PDF:', error);
        hideToast('pdf-generating');
        showToast('pdf-error');
    }
}

// Show toast notification
function showToast(type) {
    // Hide any existing toasts
    hideAllToasts();
    
    // Create toast HTML
    let toast = document.createElement('div');
    toast.id = `${type}-toast`;
    toast.classList.add('toast-notification');
    
    let iconHtml = '';
    let message = '';
    
    switch(type) {
        case 'pdf-generating':
            toast.classList.add('generating');
            iconHtml = '<div class="loading-spinner"></div>';
            message = 'Generating PDF...';
            break;
        case 'pdf-ready':
            toast.classList.add('ready');
            iconHtml = '<i class="fas fa-check-circle"></i>';
            message = 'PDF successfully generated!';
            break;
        case 'pdf-error':
            toast.classList.add('error');
            iconHtml = '<i class="fas fa-exclamation-circle"></i>';
            message = 'Error generating PDF. Please try again.';
            break;
        default:
            iconHtml = '<i class="fas fa-info-circle"></i>';
            message = type;
    }
    
    toast.innerHTML = `
        <div class="icon">${iconHtml}</div>
        <div class="message">${message}</div>
    `;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
}

// Hide specific toast
function hideToast(type) {
    const toast = document.getElementById(`${type}-toast`);
    if (toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// Hide all toasts
function hideAllToasts() {
    const toasts = document.querySelectorAll('.toast-notification');
    toasts.forEach(toast => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
}

function applyFilters() {
    // In a real application, you would filter the data and update the display
    // For this demo, we'll just show a message
    console.log('Filters applied');
}

// Helper functions
function formatCurrency(value) {
    return '₹' + value.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Invoice Creation Functions
function initInvoiceCreation() {
    // Initialize invoice creation form
    initInvoiceTabs();
    initLogoUpload();
    initInvoiceItems();
    initTaxCalculation();
    initCustomerDetailsRealTimeUpdate(); // Add this line
    initInvoiceModalButtons();
    initRealTimeCurrencyFormatting(); // Add real-time currency formatting
    
    // Set current date
    setCurrentDate();
    
    // Create invoice button
    const createInvoiceBtn = document.querySelector('.create-invoice-btn');
    if (createInvoiceBtn) {
        createInvoiceBtn.addEventListener('click', openCreateInvoiceModal);
    }
}

function initInvoiceTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const nextTabButtons = document.querySelectorAll('.next-tab-btn');
    const prevTabButtons = document.querySelectorAll('.prev-tab-btn');
    
    // Tab button click handler
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Hide all tabs
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // If switching to preview tab, update the preview
            if (tabId === 'preview-submit') {
                // Update preview with the latest data
                updateInvoicePreview();
                
                // Set up real-time sync for preview
                setupPreviewSync(true);
            } else {
                // Disable real-time sync when not on preview tab
                setupPreviewSync(false);
            }
        });
    });
    
    // Next button click handler
    nextTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextTabId = this.getAttribute('data-next');
            switchToTab(nextTabId);
        });
    });
    
    // Previous button click handler
    prevTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevTabId = this.getAttribute('data-prev');
            switchToTab(prevTabId);
        });
    });
}

function openCreateInvoiceModal() {
    const modal = document.querySelector('.create-invoice-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Reset form
    resetInvoiceForm();
    
    // Show modal and overlay
    modal.classList.add('open');
    modalOverlay.classList.add('active');
    
    // Reset to first tab
    const firstTabButton = document.querySelector('.tab-btn[data-tab="customer-details"]');
    if (firstTabButton) {
        firstTabButton.click();
    }
    
    // Set focus on first input field
    setTimeout(() => {
        const firstInput = document.getElementById('invoice-number');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

function closeCreateInvoiceModal() {
    const modal = document.querySelector('.create-invoice-modal');
    
    if (modal) {
        modal.classList.remove('open');
        
        // Also close the overlay
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }
}

function initLogoUpload() {
    const logoUpload = document.getElementById('logo-upload');
    const logoPreviewImg = document.getElementById('logo-preview-img');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const removeLogoBtn = document.getElementById('remove-logo');
    
    if (logoUpload && logoPreviewImg && uploadPlaceholder && removeLogoBtn) {
        // Handle file upload
        logoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check file type
                const fileType = file.type;
                if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/svg+xml') {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        logoPreviewImg.src = event.target.result;
                        logoPreviewImg.style.display = 'block';
                        uploadPlaceholder.style.display = 'none';
                        removeLogoBtn.style.display = 'inline-flex';
                    };
                    
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select a valid image file (PNG, JPG, or SVG)');
                }
            }
        });
        
        // Handle remove logo
        removeLogoBtn.addEventListener('click', function() {
            logoPreviewImg.src = '';
            logoPreviewImg.style.display = 'none';
            uploadPlaceholder.style.display = 'flex';
            removeLogoBtn.style.display = 'none';
            logoUpload.value = '';
        });
    }
}

function initInvoiceItems() {
    const addItemBtn = document.getElementById('add-item-btn');
    
    if (addItemBtn) {
        // Add item event listener
        addItemBtn.addEventListener('click', function() {
            addInvoiceItem();
        });
        
        // Initialize all existing item rows
        document.querySelectorAll('.item-row').forEach(row => {
            initItemRow(row);
        });
        
        // Calculate initial totals
        updateSummaryWithFeedback();
    }
    
    // Add event listener for dynamic elements (item removal and calculation)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-item-btn')) {
            const row = e.target.closest('.item-row');
            if (document.querySelectorAll('.item-row').length > 1) {
                row.remove();
                updateSummaryWithFeedback();
            } else {
                // Don't remove the last row, just clear it
                const inputs = row.querySelectorAll('input');
                inputs.forEach(input => {
                    input.value = input.type === 'number' && input.classList.contains('item-quantity') ? '1' : '';
                });
                row.querySelector('.item-amount').textContent = '0.00';
                updateSummaryWithFeedback();
            }
        }
    });
}

function initItemRow(row) {
    const quantityInput = row.querySelector('.item-quantity');
    const rateInput = row.querySelector('.item-rate');
    const discountInput = row.querySelector('.item-discount');
    const descriptionInput = row.querySelector('.item-description');
    const amountSpan = row.querySelector('.item-amount');
    
    // Update calculations in real-time as user types
    [quantityInput, rateInput, discountInput].forEach(input => {
        input.addEventListener('input', function() {
            calculateItemAmount(row);
            // Update preview in real-time if preview tab is active
            if (document.getElementById('preview-submit-tab').classList.contains('active')) {
                updatePreviewItems();
                updatePreviewSummary();
            }
        });
    });
    
    // Update description in real-time for preview
    descriptionInput.addEventListener('input', function() {
        // Update preview in real-time if preview tab is active
        if (document.getElementById('preview-submit-tab').classList.contains('active')) {
            updatePreviewItems();
        }
    });
}

function addInvoiceItem() {
    const itemsTableBody = document.querySelector('#items-table tbody');
    
    // Create a new row
    const newRow = document.createElement('tr');
    newRow.className = 'item-row';
    
    // Set row content
    newRow.innerHTML = `
        <td>
            <input type="text" class="item-description" placeholder="Item description">
        </td>
        <td>
            <input type="number" class="item-quantity" min="1" value="1">
        </td>
        <td>
            <input type="number" class="item-rate" min="0" step="0.01" placeholder="0.00">
        </td>
        <td>
            <input type="number" class="item-discount" min="0" step="0.01" placeholder="0.00">
        </td>
        <td>
            <span class="item-amount">0.00</span>
        </td>
        <td>
            <button type="button" class="remove-item-btn"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    // Add the row to the table
    itemsTableBody.appendChild(newRow);
    
    // Initialize the new row
    initItemRow(newRow);
}

function calculateItemAmount(row) {
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
    const discount = parseFloat(row.querySelector('.item-discount').value) || 0;
    
    // Calculate amount (quantity * rate - discount)
    const amount = quantity * rate - discount;
    
    // Get current amount for comparison
    const currentAmount = parseFloat(row.querySelector('.item-amount').textContent) || 0;
    
    // Update amount display
    row.querySelector('.item-amount').textContent = amount.toFixed(2);
    
    // Add highlight effect if the amount changed
    if (Math.abs(amount - currentAmount) > 0.01) {
        row.querySelector('.item-amount').classList.add('value-changed');
        setTimeout(() => {
            row.querySelector('.item-amount').classList.remove('value-changed');
        }, 500);
    }
    
    // Update summary with visual feedback
    updateSummaryWithFeedback();
}

function calculateInvoiceTotal() {
    const itemAmounts = document.querySelectorAll('.item-amount');
    const subtotalElement = document.getElementById('summary-subtotal');
    const taxRateInput = document.getElementById('tax-rate');
    const taxElement = document.getElementById('summary-tax');
    const additionalDiscountInput = document.getElementById('additional-discount');
    const shippingCostInput = document.getElementById('shipping-cost'); // Fixed ID to match HTML
    const grandTotalElement = document.getElementById('summary-grand-total');
    
    // Calculate subtotal
    let subtotal = 0;
    itemAmounts.forEach(item => {
        subtotal += parseFloat(item.textContent) || 0;
    });
    
    // Calculate tax
    const taxRate = parseFloat(taxRateInput.value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    
    // Get additional discount and shipping
    const additionalDiscount = parseFloat(additionalDiscountInput?.value) || 0;
    const shippingCost = parseFloat(shippingCostInput?.value) || 0;
    
    // Calculate grand total
    const grandTotal = subtotal + taxAmount - additionalDiscount + shippingCost;
    
    // Update display with animation for better UX
    animateValueChange(subtotalElement, subtotal.toFixed(2));
    animateValueChange(taxElement, taxAmount.toFixed(2));
    
    if (document.getElementById('summary-discount')) {
        animateValueChange(document.getElementById('summary-discount'), additionalDiscount.toFixed(2));
    }
    
    animateValueChange(grandTotalElement, grandTotal.toFixed(2));
    
    // Update preview in real-time if preview tab is active
    if (document.getElementById('preview-submit-tab') && 
        document.getElementById('preview-submit-tab').classList.contains('active')) {
        updatePreviewSummary();
    }
    
    return { subtotal, taxAmount, additionalDiscount, shippingCost, grandTotal };
}

// Helper function to animate value changes for better UX feedback
function animateValueChange(element, newValue) {
    if (!element) return;
    
    // Add a subtle highlight effect
    element.classList.add('value-changed');
    
    // Update the value
    element.textContent = newValue;
    
    // Remove the highlight effect after animation completes
    setTimeout(() => {
        element.classList.remove('value-changed');
    }, 500);
}

function initTaxCalculation() {
    const taxRateInput = document.getElementById('tax-rate');
    const additionalDiscountInput = document.getElementById('additional-discount');
    const shippingCostInput = document.getElementById('shipping-cost');
    
    // Update in real-time as user types with debounce for better performance
    if (taxRateInput) {
        taxRateInput.addEventListener('input', debounce(function() {
            updateSummaryWithFeedback();
        }, 100));
    }
    
    if (additionalDiscountInput) {
        additionalDiscountInput.addEventListener('input', debounce(function() {
            updateSummaryWithFeedback();
        }, 100));
    }
    
    if (shippingCostInput) {
        shippingCostInput.addEventListener('input', debounce(function() {
            updateSummaryWithFeedback();
        }, 100));
    }
}

// Debounce function to improve performance during rapid input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function setCurrentDate() {
    const issueDateInput = document.getElementById('issue-date');
    
    if (issueDateInput) {
        const today = new Date();
        const formattedDate = today.toISOString().substr(0, 10);
        issueDateInput.value = formattedDate;
        
        // Set due date based on payment terms
        updateDueDate();
    }
}

function updateDueDate() {
    const issueDateInput = document.getElementById('issue-date');
    const dueDateInput = document.getElementById('due-date');
    const paymentTermsSelect = document.getElementById('payment-terms');
    
    if (issueDateInput && dueDateInput && paymentTermsSelect) {
        // Get selected payment term
        const paymentTerm = paymentTermsSelect.value;
        const issueDate = new Date(issueDateInput.value);
        
        if (issueDate instanceof Date && !isNaN(issueDate)) {
            let dueDate = new Date(issueDate);
            
            // Calculate due date based on payment terms
            switch (paymentTerm) {
                case 'due-receipt':
                    // Same as issue date
                    break;
                case 'net-7':
                    dueDate.setDate(dueDate.getDate() + 7);
                    break;
                case 'net-15':
                    dueDate.setDate(dueDate.getDate() + 15);
                    break;
                case 'net-30':
                    dueDate.setDate(dueDate.getDate() + 30);
                    break;
                case 'net-60':
                    dueDate.setDate(dueDate.getDate() + 60);
                    break;
                default:
                    // Custom or no selection, don't change the due date
                    break;
            }
            
            // Set due date value
            dueDateInput.value = dueDate.toISOString().substr(0, 10);
        }
    }
}

function initInvoiceModalButtons() {
    // Payment terms change listener
    const paymentTermsSelect = document.getElementById('payment-terms');
    if (paymentTermsSelect) {
        paymentTermsSelect.addEventListener('change', updateDueDate);
    }
    
    // Issue date change listener
    const issueDateInput = document.getElementById('issue-date');
    if (issueDateInput) {
        issueDateInput.addEventListener('change', updateDueDate);
    }
    
    // Cancel button
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeCreateInvoiceModal);
    }
    
    // Close button
    const closeBtn = document.querySelector('.create-invoice-modal .close-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCreateInvoiceModal);
    }
    
    // Generate PDF button (modal footer)
    const generatePdfBtn = document.getElementById('generate-invoice-pdf-btn');
    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', generateInvoicePDF);
    }
    
    // Save Invoice button (modal footer)
    const saveInvoiceBtn = document.getElementById('save-invoice-btn');
    if (saveInvoiceBtn) {
        saveInvoiceBtn.addEventListener('click', saveInvoice);
    }
    
    // Preview tab buttons
    const previewGeneratePdfBtn = document.getElementById('preview-generate-pdf-btn');
    if (previewGeneratePdfBtn) {
        previewGeneratePdfBtn.addEventListener('click', generateInvoicePDF);
    }
    
    const previewSaveInvoiceBtn = document.getElementById('preview-save-invoice-btn');
    if (previewSaveInvoiceBtn) {
        previewSaveInvoiceBtn.addEventListener('click', saveInvoice);
    }
}

function resetInvoiceForm() {
    // Reset logo
    const logoPreviewImg = document.getElementById('logo-preview-img');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const removeLogoBtn = document.getElementById('remove-logo');
    
    if (logoPreviewImg && uploadPlaceholder && removeLogoBtn) {
        logoPreviewImg.src = '';
        logoPreviewImg.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
        removeLogoBtn.style.display = 'none';
    }
    
    // Reset invoice number
    const invoiceNumberInput = document.getElementById('invoice-number');
    if (invoiceNumberInput) {
        // Generate a new invoice number
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        invoiceNumberInput.value = `INV-${year}${month}-${random}`;
    }
    
    // Reset dates
    setCurrentDate();
    
    // Reset items table
    const itemsTableBody = document.querySelector('#items-table tbody');
    if (itemsTableBody) {
        // Remove all rows except the first one
        while (itemsTableBody.children.length > 1) {
            itemsTableBody.removeChild(itemsTableBody.lastChild);
        }
        
        // Clear first row inputs
        const firstRow = itemsTableBody.querySelector('.item-row');
        if (firstRow) {
            const inputs = firstRow.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = input.type === 'number' && input.classList.contains('item-quantity') ? '1' : '';
            });
            firstRow.querySelector('.item-amount').textContent = '0.00';
        }
    }
    
    // Reset summary
    calculateInvoiceTotal();
    
    // Reset other inputs
    document.getElementById('customer-supplier').value = '';
    document.getElementById('invoice-notes').value = '';
}

function generateInvoicePDF() {
    // Validate form
    if (!validateInvoiceForm()) {
        // Switch to the tab where validation failed
        if (!document.getElementById('invoice-number').value || !document.getElementById('customer-supplier').value) {
            switchToTab('customer-details');
        } else {
            switchToTab('item-list');
        }
        return;
    }
    
    // Show generating toast
    showToast('pdf-generating');
    
    // Collect all invoice data
    const invoiceNumber = document.getElementById('invoice-number').value;
    const issueDate = formatDate(document.getElementById('issue-date').value);
    const dueDate = formatDate(document.getElementById('due-date').value);
    const customerName = document.getElementById('customer-supplier').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    
    // Collect items data
    const itemRows = document.querySelectorAll('.item-row');
    const items = [];
    
    itemRows.forEach(row => {
        const description = row.querySelector('.item-description').value;
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        const discount = parseFloat(row.querySelector('.item-discount').value) || 0;
        const amount = parseFloat(row.querySelector('.item-amount').textContent) || 0;
        
        if (description && quantity > 0) {
            items.push({
                description,
                quantity,
                rate,
                discount,
                amount
            });
        }
    });
    
    // Get totals
    const subtotal = parseFloat(document.getElementById('summary-subtotal').textContent) || 0;
    const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
    const taxAmount = parseFloat(document.getElementById('summary-tax').textContent) || 0;
    const additionalDiscount = parseFloat(document.getElementById('additional-discount').value) || 0;
    const shipping = parseFloat(document.getElementById('shipping-cost').value) || 0;
    const grandTotal = parseFloat(document.getElementById('summary-grand-total').textContent) || 0;
    const notes = document.getElementById('invoice-notes').value;
    
    // Create PDF using jsPDF
    try {
        // Initialize PDF
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set default font
        pdf.setFont("helvetica");
        
        // Add header
        pdf.setFontSize(22);
        pdf.setTextColor(44, 62, 80); // Dark text color
        pdf.text("INVOICE", 105, 20, { align: "center" });
        
        // Add invoice info
        pdf.setFontSize(10);
        pdf.setTextColor(52, 73, 94);
        pdf.text(`Invoice #: ${invoiceNumber}`, 200, 20, { align: "right" });
        pdf.text(`Date: ${issueDate}`, 200, 25, { align: "right" });
        pdf.text(`Due Date: ${dueDate}`, 200, 30, { align: "right" });
        
        // Add company info (sender)
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("From:", 15, 40);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("Your Company Name", 15, 45);
        pdf.text("Your Company Address", 15, 50);
        
        // Add customer info (recipient)
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("To:", 120, 40);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(customerName, 120, 45);
        if (customerAddress) {
            const addressLines = pdf.splitTextToSize(customerAddress, 70);
            pdf.text(addressLines, 120, 50);
            let yPos = 50 + addressLines.length * 5;
            if (customerEmail) pdf.text(`Email: ${customerEmail}`, 120, yPos += 5);
            if (customerPhone) pdf.text(`Phone: ${customerPhone}`, 120, yPos += 5);
        } else {
            let yPos = 45;
            if (customerEmail) pdf.text(`Email: ${customerEmail}`, 120, yPos += 5);
            if (customerPhone) pdf.text(`Phone: ${customerPhone}`, 120, yPos += 5);
        }
        
        // Add items table
        const tableColumns = [
            { header: 'Item Description', dataKey: 'description' },
            { header: 'Quantity', dataKey: 'quantity' },
            { header: 'Rate', dataKey: 'rate' },
            { header: 'Discount', dataKey: 'discount' },
            { header: 'Amount', dataKey: 'amount' }
        ];
        
        const tableRows = items.map(item => ({
            description: item.description,
            quantity: item.quantity.toString(),
            rate: formatCurrency(item.rate).replace('₹', ''),
            discount: formatCurrency(item.discount).replace('₹', ''),
            amount: formatCurrency(item.amount).replace('₹', '')
        }));
        
        pdf.autoTable({
            startY: 70,
            head: [tableColumns.map(col => col.header)],
            body: tableRows,
            theme: 'grid',
            headStyles: {
                fillColor: [108, 92, 231],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 80 }, // Description
                1: { cellWidth: 20, halign: 'center' }, // Quantity
                2: { cellWidth: 25, halign: 'right' }, // Rate
                3: { cellWidth: 25, halign: 'right' }, // Discount
                4: { cellWidth: 30, halign: 'right' }  // Amount
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            didDrawPage: function(data) {
                // Add page number
                pdf.setFontSize(8);
                pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, 
                    pdf.internal.pageSize.width - 20, 
                    pdf.internal.pageSize.height - 10);
            }
        });
        
        // Add summary section
        const finalY = pdf.lastAutoTable.finalY + 10;
        
        // Summary table
        pdf.autoTable({
            startY: finalY,
            body: [
                ['Subtotal:', formatCurrency(subtotal).replace('₹', '')],
                [`Tax (${taxRate}%):`, formatCurrency(taxAmount).replace('₹', '')],
                ['Additional Discount:', formatCurrency(additionalDiscount).replace('₹', '')],
                ['Shipping:', formatCurrency(shipping).replace('₹', '')],
                ['Grand Total:', formatCurrency(grandTotal).replace('₹', '')]
            ],
            theme: 'plain',
            columnStyles: {
                0: { cellWidth: 150, fontStyle: 'bold' },
                1: { cellWidth: 30, halign: 'right' }
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            margin: { left: 120 }
        });
        
        // Add notes section
        if (notes) {
            const finalY2 = pdf.lastAutoTable.finalY + 10;
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.text("Notes:", 15, finalY2);
            pdf.setFont("helvetica", "normal");
            
            const noteLines = pdf.splitTextToSize(notes, 180);
            pdf.text(noteLines, 15, finalY2 + 5);
        }
        
        // Add footer
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text("Thank you for your business!", 105, pdf.internal.pageSize.height - 10, { align: "center" });
        
        // Save and open PDF
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Hide generating toast and show success toast
        hideToast('pdf-generating');
        showToast('pdf-ready');
        
        // Open PDF in new tab
        window.open(pdfUrl, '_blank');
        
        // Show success notification
        const notification = document.createElement('div');
        notification.classList.add('success-notification');
        notification.innerHTML = `
            <div class="notification-icon"><i class="fas fa-check-circle"></i></div>
            <div class="notification-message">
                <h4>Invoice Successfully Generated</h4>
                <p>Invoice PDF has been generated and opened in a new tab.</p>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Show and then fade out the notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
        
        // Hide success toast after 2 seconds
        setTimeout(() => {
            hideToast('pdf-ready');
        }, 2000);
        
    } catch (error) {
        console.error('Error creating PDF:', error);
        hideToast('pdf-generating');
        showToast('pdf-error');
    }
}

// Function to add a new invoice to the UI
function addNewInvoiceToUI(invoice) {
    // Add to table view
    const tableBody = document.querySelector('.invoice-table tbody');
    if (tableBody) {
        // Format invoice data for table row
        const formattedSubtotal = formatCurrency(invoice.subtotal);
        const formattedTax = formatCurrency(invoice.tax);
        const formattedDiscount = formatCurrency(invoice.discount);
        const formattedGrandTotal = formatCurrency(invoice.grandTotal);
        const formattedDate = formatDate(invoice.date);
        const productSummary = invoice.products.map(p => p.description).join(', ');
        
        // Create new table row HTML
        const newRow = document.createElement('tr');
        newRow.classList.add('expandable-row');
        newRow.setAttribute('data-id', invoice.id);
        newRow.innerHTML = `
            <td>${invoice.id}</td>
            <td>${formattedDate}</td>
            <td><span class="invoice-type ${invoice.type}">${invoice.type === 'sales' ? 'Sales' : 'Purchase'}</span></td>
            <td>${invoice.type === 'sales' ? invoice.customer : invoice.customer}</td>
            <td>${productSummary}</td>
            <td>${formattedSubtotal}</td>
            <td>${formattedTax}</td>
            <td>${formattedDiscount}</td>
            <td>${formattedGrandTotal}</td>
            <td>${invoice.paymentMode}</td>
            <td><span class="payment-status ${invoice.status}">${capitalizeFirstLetter(invoice.status)}</span></td>
            <td>${invoice.dueDate ? formatDate(invoice.dueDate) : '-'}</td>
            <td>${invoice.handler}</td>
            <td class="actions">
                <button class="action-btn view" data-id="${invoice.id}" title="View"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit" data-id="${invoice.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" data-id="${invoice.id}" title="Delete"><i class="fas fa-trash"></i></button>
                <button class="action-btn pdf" data-id="${invoice.id}" title="Generate PDF"><i class="fas fa-file-pdf"></i></button>
            </td>
        `;
        
        // Add expansion panel row
        const expansionRow = document.createElement('tr');
        expansionRow.classList.add('expansion-panel');
        expansionRow.setAttribute('data-id', invoice.id);
        expansionRow.innerHTML = `
            <td colspan="14">
                <div class="expansion-content">
                    <h3>Products</h3>
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generateProductRowsFromInvoice(invoice.products)}
                        </tbody>
                    </table>
                    
                    <div class="invoice-summary">
                        <table class="summary-table">
                            <tr>
                                <td>Subtotal:</td>
                                <td>${formattedSubtotal}</td>
                            </tr>
                            <tr>
                                <td>Tax:</td>
                                <td>${formattedTax}</td>
                            </tr>
                            <tr>
                                <td>Discount:</td>
                                <td>- ${formattedDiscount}</td>
                            </tr>
                            <tr class="grand-total">
                                <td>Grand Total:</td>
                                <td>${formattedGrandTotal}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>
        `;
        
        // Insert the new rows at the top of the table
        tableBody.insertBefore(expansionRow, tableBody.firstChild);
        tableBody.insertBefore(newRow, tableBody.firstChild);
        
        // Add event listeners to the new row
        newRow.addEventListener('click', function() {
            this.classList.toggle('expanded');
            const panel = document.querySelector(`.expansion-panel[data-id="${invoice.id}"]`);
            if (panel) {
                panel.classList.toggle('visible');
            }
        });
        
        // Add event listeners to the action buttons
        const viewBtn = newRow.querySelector('.action-btn.view');
        const editBtn = newRow.querySelector('.action-btn.edit');
        const deleteBtn = newRow.querySelector('.action-btn.delete');
        const pdfBtn = newRow.querySelector('.action-btn.pdf');
        
        if (viewBtn) viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openInvoiceModal(invoice.id);
        });
        
        if (editBtn) editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            editInvoice(invoice.id);
        });
        
        if (deleteBtn) deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteInvoice(invoice.id);
        });
        
        if (pdfBtn) pdfBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            generatePDF(invoice.id);
        });
    }
    
    // Add to card view
    const cardContainer = document.querySelector('.invoice-cards');
    if (cardContainer) {
        const formattedDate = formatDate(invoice.date);
        const formattedGrandTotal = formatCurrency(invoice.grandTotal);
        
        const card = document.createElement('div');
        card.classList.add('invoice-card');
        card.innerHTML = `
            <div class="card-header">
                <div class="invoice-id">${invoice.id}</div>
                <div class="invoice-status ${invoice.status}">${capitalizeFirstLetter(invoice.status)}</div>
            </div>
            <div class="card-body">
                <div class="invoice-type ${invoice.type}">${invoice.type === 'sales' ? 'Sales' : 'Purchase'}</div>
                <div class="invoice-date">${formattedDate}</div>
                <div class="invoice-customer">${invoice.customer}</div>
                <div class="invoice-total">${formattedGrandTotal}</div>
            </div>
            <div class="card-footer">
                <button class="card-action-btn view" data-id="${invoice.id}" title="View"><i class="fas fa-eye"></i></button>
                <button class="card-action-btn edit" data-id="${invoice.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="card-action-btn delete" data-id="${invoice.id}" title="Delete"><i class="fas fa-trash"></i></button>
                <button class="card-action-btn pdf" data-id="${invoice.id}" title="Generate PDF"><i class="fas fa-file-pdf"></i></button>
            </div>
        `;
        
        // Insert the new card at the beginning of the container
        cardContainer.insertBefore(card, cardContainer.firstChild);
        
        // Add event listeners to card action buttons
        const viewBtn = card.querySelector('.card-action-btn.view');
        const editBtn = card.querySelector('.card-action-btn.edit');
        const deleteBtn = card.querySelector('.card-action-btn.delete');
        const pdfBtn = card.querySelector('.card-action-btn.pdf');
        
        if (viewBtn) viewBtn.addEventListener('click', function() {
            openInvoiceModal(invoice.id);
        });
        
        if (editBtn) editBtn.addEventListener('click', function() {
            editInvoice(invoice.id);
        });
        
        if (deleteBtn) deleteBtn.addEventListener('click', function() {
            deleteInvoice(invoice.id);
        });
        
        if (pdfBtn) pdfBtn.addEventListener('click', function() {
            generatePDF(invoice.id);
        });
    }
    
    // Hide any "No invoices found" empty states
    const emptyStates = document.querySelectorAll('.empty-state');
    emptyStates.forEach(state => {
        state.style.display = 'none';
    });
    
    // Show success notification
    const notification = document.createElement('div');
    notification.classList.add('success-notification');
    notification.innerHTML = `
        <div class="notification-icon"><i class="fas fa-check-circle"></i></div>
        <div class="notification-message">
            <h4>Invoice Successfully Generated</h4>
            <p>Invoice ${invoice.id} has been generated and saved.</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Show and then fade out the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Helper function to generate product rows from invoice data
function generateProductRowsFromInvoice(products) {
    let html = '';
    
    products.forEach(product => {
        const formattedRate = formatCurrency(product.rate);
        const formattedAmount = formatCurrency(product.amount);
        
        html += `
            <tr>
                <td>${product.description}</td>
                <td>${product.quantity}</td>
                <td>${formattedRate}</td>
                <td>${formattedAmount}</td>
            </tr>
        `;
    });
    
    return html;
}

function saveInvoice() {
    // Validate form
    if (!validateInvoiceForm()) {
        // Switch to the tab where validation failed
        if (!document.getElementById('invoice-number').value || !document.getElementById('customer-supplier').value) {
            switchToTab('customer-details');
        } else {
            switchToTab('item-list');
        }
        return;
    }
    
    // In a real application, you would send the form data to the server
    // to save the invoice
    
    // For demo purposes, we'll just show a success message and close the modal
    alert('Invoice saved successfully!');
    closeCreateInvoiceModal();
    
    // Reload the invoice list (in a real app, you would fetch updated data from the server)
    loadSampleData();
}

function validateInvoiceForm(silent = false) {
    // Get required fields
    const invoiceNumber = document.getElementById('invoice-number').value;
    const customerSupplier = document.getElementById('customer-supplier').value;
    
    // Check required fields
    let isValid = true;
    
    if (!invoiceNumber) {
        if (!silent) alert('Please enter an invoice number');
        isValid = false;
    }
    
    if (!customerSupplier) {
        if (!silent) alert('Please enter a customer/supplier name');
        isValid = false;
    }
    
    // Check if at least one item has a description and a rate
    const itemRows = document.querySelectorAll('.item-row');
    let hasValidItem = false;
    
    for (const row of itemRows) {
        const description = row.querySelector('.item-description').value;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        
        if (description && rate > 0) {
            hasValidItem = true;
            break;
        }
    }
    
    if (!hasValidItem) {
        if (!silent) alert('Please add at least one item with a description and a rate');
        isValid = false;
    }
    
    return isValid;
}

function updateInvoicePreview() {
    // Check if all required fields are filled
    const isFormValid = validateInvoiceForm(true);
    
    // Update invoice header information
    document.getElementById('preview-invoice-number').textContent = document.getElementById('invoice-number').value || 'N/A';
    
    const issueDate = document.getElementById('issue-date').value;
    const dueDate = document.getElementById('due-date').value;
    
    document.getElementById('preview-date').textContent = issueDate ? formatDate(issueDate) : 'N/A';
    document.getElementById('preview-due-date').textContent = dueDate ? formatDate(dueDate) : 'N/A';
    
    // Update customer information
    document.getElementById('preview-customer-name').textContent = document.getElementById('customer-supplier').value || 'N/A';
    document.getElementById('preview-customer-address').textContent = document.getElementById('customer-address').value || '';
    document.getElementById('preview-customer-email').textContent = document.getElementById('customer-email').value || '';
    document.getElementById('preview-customer-phone').textContent = document.getElementById('customer-phone').value || '';
    
    // Update logo
    const logoPreviewImg = document.getElementById('logo-preview-img');
    const previewLogo = document.getElementById('preview-logo');
    
    if (logoPreviewImg.src && logoPreviewImg.style.display !== 'none') {
        // Create a new image for the preview
        const logoImg = document.createElement('img');
        logoImg.src = logoPreviewImg.src;
        
        // Clear previous content and append the new image
        previewLogo.innerHTML = '';
        previewLogo.appendChild(logoImg);
    } else {
        previewLogo.innerHTML = '<div class="no-logo">No Logo</div>';
    }
    
    // Update items
    updatePreviewItems();
    
    // Update summary
    updatePreviewSummary();
    
    // Update notes
    document.getElementById('preview-notes-content').textContent = document.getElementById('invoice-notes').value || 'No additional notes.';
    
    // Scroll to top of preview container
    const previewContainer = document.querySelector('.invoice-preview-container');
    if (previewContainer) {
        previewContainer.scrollTop = 0;
    }
    
    return isFormValid;
}

function updatePreviewItems() {
    const itemsTableBody = document.getElementById('preview-items-body');
    const itemRows = document.querySelectorAll('.item-row');
    let html = '';
    
    itemRows.forEach(row => {
        const description = row.querySelector('.item-description').value || 'N/A';
        const quantity = row.querySelector('.item-quantity').value || '0';
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        const discount = parseFloat(row.querySelector('.item-discount').value) || 0;
        const amount = parseFloat(row.querySelector('.item-amount').textContent) || 0;
        
        // Skip empty rows
        if (description === 'N/A' && rate === 0) {
            return;
        }
        
        html += `
            <tr>
                <td>${description}</td>
                <td>${quantity}</td>
                <td>${formatCurrency(rate)}</td>
                <td>${formatCurrency(discount)}</td>
                <td>${formatCurrency(amount)}</td>
            </tr>
        `;
    });
    
    // If no items, show a message
    if (!html) {
        html = `
            <tr>
                <td colspan="5" style="text-align: center;">No items added</td>
            </tr>
        `;
    }
    
    itemsTableBody.innerHTML = html;
}

function updatePreviewSummary() {
    const subtotal = parseFloat(document.getElementById('summary-subtotal').textContent) || 0;
    const tax = parseFloat(document.getElementById('summary-tax').textContent) || 0;
    const discount = parseFloat(document.getElementById('additional-discount').value) || 0;
    const shipping = parseFloat(document.getElementById('shipping-cost').value) || 0;
    
    // Calculate grand total
    const grandTotal = subtotal + tax - discount + shipping;
    
    // Update preview summary
    document.getElementById('preview-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('preview-tax').textContent = formatCurrency(tax);
    document.getElementById('preview-discount').textContent = formatCurrency(discount);
    document.getElementById('preview-shipping').textContent = formatCurrency(shipping);
    document.getElementById('preview-grand-total').textContent = formatCurrency(grandTotal);
}

// Helper function to switch tabs (global scope for reuse)
function switchToTab(tabId) {
    // Find the tab button for the tab
    const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (!tabButton) return;
    
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Update active tab button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabButton.classList.add('active');
    
    // Update active tab content
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
            
            // Scroll to top of tab content
            content.scrollTop = 0;
            
            // If this is the preview tab, update the preview
            if (tabId === 'preview-submit') {
                updateInvoicePreview();
                setupPreviewSync(true);
                
                // Ensure the invoice preview container is scrolled to top
                const previewContainer = document.querySelector('.invoice-preview-container');
                if (previewContainer) {
                    previewContainer.scrollTop = 0;
                }
            } else {
                // Disable real-time sync when not on preview tab
                setupPreviewSync(false);
            }
        }
    });
    
    // Scroll tab into view if needed
    tabButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

// Function to add toast notifications to the page
function addToastNotifications() {
    // Check if toasts already exist
    if (document.querySelector('.toast.pdf-generating')) return;
    
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.classList.add('toast-container');
        document.body.appendChild(toastContainer);
    }
    
    // Add PDF generating toast
    const generatingToast = document.createElement('div');
    generatingToast.classList.add('toast', 'pdf-generating');
    generatingToast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">Generating PDF</div>
            <div class="toast-message">Creating your invoice PDF...</div>
        </div>
    `;
    toastContainer.appendChild(generatingToast);
    
    // Add PDF ready toast
    const readyToast = document.createElement('div');
    readyToast.classList.add('toast', 'pdf-ready');
    readyToast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">PDF Ready</div>
            <div class="toast-message">Your invoice PDF has been generated and opened in a new tab.</div>
        </div>
    `;
    toastContainer.appendChild(readyToast);
    
    // Add PDF error toast
    const errorToast = document.createElement('div');
    errorToast.classList.add('toast', 'pdf-error');
    errorToast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">Error</div>
            <div class="toast-message">Failed to generate PDF. Please try again.</div>
        </div>
    `;
    toastContainer.appendChild(errorToast);
    
    // Add CSS styles for notifications and enhanced PDF button
    const style = document.createElement('style');
    style.textContent = `
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .toast {
            display: flex;
            align-items: center;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 15px;
            margin-bottom: 10px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            max-width: 350px;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-icon {
            margin-right: 15px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .toast.pdf-generating .toast-icon {
            color: #6c5ce7;
        }
        
        .toast.pdf-ready .toast-icon {
            color: #00b894;
        }
        
        .toast.pdf-error .toast-icon {
            color: #e74c3c;
        }
        
        .toast-content {
            flex: 1;
        }
        
        .toast-title {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .toast-message {
            font-size: 14px;
            color: #666;
        }
        
        .success-notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #00b894;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            max-width: 400px;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 9999;
        }
        
        .success-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-icon {
            margin-right: 15px;
            font-size: 24px;
        }
        
        .notification-message h4 {
            margin: 0 0 5px 0;
            font-weight: 600;
        }
        
        .notification-message p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        
        /* Enhanced Generate PDF Button Styles */
        #preview-generate-pdf-btn, #generate-invoice-pdf-btn, .generate-pdf-btn, .action-btn.pdf, .card-btn.pdf {
            background-color: #e74c3c;
            color: white;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(231, 76, 60, 0.2);
            position: relative;
            overflow: hidden;
        }
        
        .action-btn.pdf, .card-btn.pdf {
            padding: 8px;
            border-radius: 4px;
        }
        
        #preview-generate-pdf-btn::before, #generate-invoice-pdf-btn::before, .generate-pdf-btn::before, .action-btn.pdf::before, .card-btn.pdf::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
            top: 0;
            left: -100%;
            transition: all 0.5s ease;
        }
        
        #preview-generate-pdf-btn:hover, #generate-invoice-pdf-btn:hover, .generate-pdf-btn:hover, .action-btn.pdf:hover, .card-btn.pdf:hover {
            background-color: #c0392b;
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(231, 76, 60, 0.3);
        }
        
        #preview-generate-pdf-btn:hover::before, #generate-invoice-pdf-btn:hover::before, .generate-pdf-btn:hover::before, .action-btn.pdf:hover::before, .card-btn.pdf:hover::before {
            left: 100%;
        }
        
        #preview-generate-pdf-btn:active, #generate-invoice-pdf-btn:active, .generate-pdf-btn:active, .action-btn.pdf:active, .card-btn.pdf:active {
            transform: translateY(1px);
            box-shadow: 0 2px 4px rgba(231, 76, 60, 0.2);
        }
        
        #preview-generate-pdf-btn i, #generate-invoice-pdf-btn i, .generate-pdf-btn i {
            margin-right: 8px;
            font-size: 16px;
        }
        
        /* Add a highlight animation */
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
            }
        }
        
        /* Apply the animation when the form is valid */
        .form-valid #preview-generate-pdf-btn, .form-valid #generate-invoice-pdf-btn, 
        .generate-pdf-btn, .action-btn.pdf, .card-btn.pdf {
            animation: pulse 2s infinite;
        }
        
        /* Add instant indicator badge to PDF buttons */
        #preview-generate-pdf-btn::after, #generate-invoice-pdf-btn::after, .generate-pdf-btn::after {
            content: "Instant";
            position: absolute;
            top: -10px;
            right: -10px;
            background-color: #00b894;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0, 184, 148, 0.3);
            transform: rotate(10deg);
        }
        
        /* Add focus style to highlight accessibility */
        #preview-generate-pdf-btn:focus, #generate-invoice-pdf-btn:focus, .generate-pdf-btn:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.5);
        }
        
        /* Make button more prominent in the modal footer */
        .modal-footer #generate-invoice-pdf-btn, .modal-footer .generate-pdf-btn {
            margin-right: 10px;
        }
        
        /* Make preview actions more visually distinct */
        .preview-actions {
            display: flex;
            gap: 15px;
        }
        
        /* Add a badge to highlight new downloads */
        .action-btn.pdf::after, .card-btn.pdf::after {
            content: '';
            position: absolute;
            top: -5px;
            right: -5px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #e74c3c;
            display: none;
        }
        
        .new-download .action-btn.pdf::after, .new-download .card-btn.pdf::after {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // Update button text to indicate instant viewing
    const pdfButtons = document.querySelectorAll('#preview-generate-pdf-btn, #generate-invoice-pdf-btn, .generate-pdf-btn');
    pdfButtons.forEach(button => {
        if (button.innerHTML.indexOf('Instant') === -1) {
            button.innerHTML = `<i class="fas fa-file-pdf"></i> Generate PDF Instantly`;
        }
    });
    
    // Add class to validate form when all required fields are filled
    setInterval(() => {
        if (validateInvoiceForm(true)) {
            document.getElementById('preview-submit-tab')?.classList.add('form-valid');
        } else {
            document.getElementById('preview-submit-tab')?.classList.remove('form-valid');
        }
    }, 1000);
}

// Setup preview sync functionality
function setupPreviewSync(enable) {
    const formInputs = document.querySelectorAll('#create-invoice-form input, #create-invoice-form textarea, #create-invoice-form select');
    
    if (enable) {
        // Enable real-time preview for all form inputs
        formInputs.forEach(input => {
            input.addEventListener('input', previewSyncHandler);
        });
    } else {
        // Remove real-time preview handlers
        formInputs.forEach(input => {
            input.removeEventListener('input', previewSyncHandler);
        });
    }
}

// Handler function for preview sync
function previewSyncHandler(e) {
    // Debounce preview updates for better performance
    debouncePreviewUpdate();
}

// Create a debounced preview update function
let previewUpdateTimeout;
function debouncePreviewUpdate() {
    clearTimeout(previewUpdateTimeout);
    previewUpdateTimeout = setTimeout(() => {
        updateInvoicePreview();
    }, 200);
}

// Format currency in real-time for better user experience
function initRealTimeCurrencyFormatting() {
    // Get currency input fields (rate, discount, additional discount, shipping)
    const currencyInputs = document.querySelectorAll('.item-rate, .item-discount, #additional-discount, #shipping-cost');
    
    // Add currency formatting as user types
    currencyInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // When focused, display raw number for editing
            const value = parseFloat(this.value.replace(/[^0-9.-]+/g, '')) || 0;
            this.value = value.toString();
        });
        
        input.addEventListener('blur', function() {
            // When blurred, format as currency
            const value = parseFloat(this.value) || 0;
            if (!this.classList.contains('item-discount') && !this.id === 'additional-discount') {
                this.value = value.toFixed(2);
            } else {
                // For discount fields, show zero as empty
                this.value = value === 0 ? '' : value.toFixed(2);
            }
        });
    });
}

// Function to provide real-time visual feedback of changes to the summary
function updateSummaryWithFeedback() {
    // Get current values for animation
    const currentSubtotal = parseFloat(document.getElementById('summary-subtotal').textContent) || 0;
    const currentTax = parseFloat(document.getElementById('summary-tax').textContent) || 0;
    const currentGrandTotal = parseFloat(document.getElementById('summary-grand-total').textContent) || 0;
    
    // Calculate new values
    const result = calculateInvoiceTotal();
    
    // Add a visual indicator for changes
    if (Math.abs(result.subtotal - currentSubtotal) > 0.01) {
        document.getElementById('summary-subtotal').parentElement.classList.add('value-updated');
        setTimeout(() => {
            document.getElementById('summary-subtotal').parentElement.classList.remove('value-updated');
        }, 1000);
    }
    
    if (Math.abs(result.grandTotal - currentGrandTotal) > 0.01) {
        document.getElementById('summary-grand-total').parentElement.classList.add('value-updated');
        setTimeout(() => {
            document.getElementById('summary-grand-total').parentElement.classList.remove('value-updated');
        }, 1000);
    }
    
    // Update preview if active
    if (document.getElementById('preview-submit-tab') && 
        document.getElementById('preview-submit-tab').classList.contains('active')) {
        updatePreviewItems();
        updatePreviewSummary();
    }
}

// Function to initialize real-time customer/supplier details update
function initCustomerDetailsRealTimeUpdate() {
    // Get all customer/supplier input fields
    const customerInputs = [
        document.getElementById('customer-supplier'),
        document.getElementById('customer-email'),
        document.getElementById('customer-phone'),
        document.getElementById('customer-address')
    ];
    
    // Add real-time update for customer details
    customerInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', debounce(function() {
                // Update preview in real-time if preview tab is active
                if (document.getElementById('preview-submit-tab') && 
                    document.getElementById('preview-submit-tab').classList.contains('active')) {
                    // Update just the customer preview fields
                    document.getElementById('preview-customer-name').textContent = 
                        document.getElementById('customer-supplier').value || 'N/A';
                    document.getElementById('preview-customer-address').textContent = 
                        document.getElementById('customer-address').value || '';
                    document.getElementById('preview-customer-email').textContent = 
                        document.getElementById('customer-email').value || '';
                    document.getElementById('preview-customer-phone').textContent = 
                        document.getElementById('customer-phone').value || '';
                }
            }, 200));
        }
    });
}

// Update initInvoiceCreation to include our new function
function initInvoiceCreation() {
    // Initialize invoice creation form
    initInvoiceTabs();
    initLogoUpload();
    initInvoiceItems();
    initTaxCalculation();
    initCustomerDetailsRealTimeUpdate(); // Add this line
    initInvoiceModalButtons();
    initRealTimeCurrencyFormatting(); // Add real-time currency formatting
    
    // Set current date
    setCurrentDate();
    
    // Create invoice button
    const createInvoiceBtn = document.querySelector('.create-invoice-btn');
    if (createInvoiceBtn) {
        createInvoiceBtn.addEventListener('click', openCreateInvoiceModal);
    }
}

// Helper function to format dates consistently
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString; // Fallback to original string
    }
}

// Helper function for currency formatting
function formatCurrency(amount, currency = '₹') {
    return `${currency}${parseFloat(amount).toFixed(2)}`;
} 