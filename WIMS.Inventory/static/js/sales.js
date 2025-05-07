// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Sales page loaded - initializing");
    
    try {
        // Fetch elements
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        const customerFilter = document.getElementById('customer-filter');
        const paymentModeFilter = document.getElementById('payment-mode-filter');
        const saleSearch = document.getElementById('sale-search');
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const viewContainers = document.querySelectorAll('.view-container');
        const salesTable = document.querySelector('.sales-table');
        const newSaleBtn = document.querySelector('.new-sale-btn');
        
        // Log whether elements were found
        console.log("Elements found:", {
            dateFromInput: !!dateFromInput,
            dateToInput: !!dateToInput,
            customerFilter: !!customerFilter,
            paymentModeFilter: !!paymentModeFilter,
            saleSearch: !!saleSearch,
            toggleBtns: toggleBtns.length,
            viewContainers: viewContainers.length,
            salesTable: !!salesTable,
            newSaleBtn: !!newSaleBtn
        });
        
        // Set default date range (last 30 days)
        setDefaultDateRange();
        
        // Make sure sidebar Sales link is active
        activateSidebarLink();
        
        // Setup view toggle (table/card view)
        setupViewToggle();
        
        // Setup products toggle buttons
        setupProductsToggles();
        
        // Setup search and filter functionality
        setupSearchAndFilters();
        
        // Setup action buttons
        setupActionButtons();
        
        // Log successful initialization
        console.log("Sales page initialization complete");
        
        // Set default date range to last 30 days
        function setDefaultDateRange() {
            if (dateFromInput && dateToInput) {
                const today = new Date();
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(today.getDate() - 30);
                
                // Format dates as YYYY-MM-DD for the input fields
                dateToInput.value = formatDateForInput(today);
                dateFromInput.value = formatDateForInput(thirtyDaysAgo);
                
                console.log("Date range set:", {
                    from: dateFromInput.value,
                    to: dateToInput.value
                });
            }
        }
        
        // Helper function to format dates for input fields
        function formatDateForInput(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        
        // Make sure sidebar Sales link is marked as active
        function activateSidebarLink() {
            try {
                // Find the Sales link in the sidebar and ensure it's active
                const sidebarItems = document.querySelectorAll('.sidebar-menu li');
                sidebarItems.forEach(item => {
                    // Remove active from all
                    item.classList.remove('active');
                    
                    // Check if this is the Sales link
                    const link = item.querySelector('a');
                    if (link && link.getAttribute('href') === 'sales.html') {
                        item.classList.add('active');
                        console.log("Sales sidebar link activated");
                    }
                });
            } catch (error) {
                console.error("Error activating sidebar link:", error);
            }
        }
        
        // Handle view toggle between table and card views
        function setupViewToggle() {
            try {
                toggleBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const viewType = this.getAttribute('data-view');
                        console.log(`Switching to ${viewType} view`);
                        
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
                console.log("View toggle initialized");
            } catch (error) {
                console.error("Error setting up view toggle:", error);
            }
        }
        
        // Setup products toggle buttons to show/hide product details
        function setupProductsToggles() {
            try {
                const productsToggleBtns = document.querySelectorAll('.products-toggle');
                productsToggleBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productsDetails = this.nextElementSibling;
                        productsDetails.classList.toggle('show');
                        this.textContent = productsDetails.classList.contains('show') ? 'Hide Products' : 'View Products';
                    });
                });
                console.log("Products toggles initialized");
            } catch (error) {
                console.error("Error setting up products toggles:", error);
            }
        }
        
        // Setup search and filter functionality
        function setupSearchAndFilters() {
            try {
                // Get all table rows and card items
                const tableRows = salesTable ? salesTable.querySelectorAll('tbody tr') : [];
                const saleCards = document.querySelectorAll('.sale-card');
                
                // Function to apply filters
                const applyFilters = () => {
                    const searchTerm = saleSearch ? saleSearch.value.toLowerCase() : '';
                    const selectedCustomer = customerFilter ? customerFilter.value : '';
                    const selectedPaymentMode = paymentModeFilter ? paymentModeFilter.value : '';
                    const fromDate = dateFromInput ? new Date(dateFromInput.value) : null;
                    const toDate = dateToInput ? new Date(dateToInput.value) : null;
                    
                    // Adjust to date to include the entire day
                    if (toDate) {
                        toDate.setHours(23, 59, 59, 999);
                    }
                    
                    // Filter table rows
                    let tableMatchCount = 0;
                    tableRows.forEach(row => {
                        const invoiceNumber = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                        const dateStr = row.querySelector('td:nth-child(2)').textContent;
                        const customer = row.querySelector('td:nth-child(3)').textContent;
                        const paymentModeElement = row.querySelector('.payment-mode');
                        const paymentMode = paymentModeElement ? paymentModeElement.textContent : '';
                        
                        // Parse date
                        const dateParts = dateStr.split(' ');
                        const day = parseInt(dateParts[0]);
                        const month = getMonthNumber(dateParts[1]);
                        const year = parseInt(dateParts[2]);
                        const rowDate = new Date(year, month, day);
                        
                        // Check if row matches all filters
                        const matchesSearch = invoiceNumber.includes(searchTerm);
                        const matchesCustomer = !selectedCustomer || customer === selectedCustomer;
                        const matchesPaymentMode = !selectedPaymentMode || paymentMode === selectedPaymentMode;
                        const matchesDateRange = (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);
                        
                        // Show or hide row based on filters
                        if (matchesSearch && matchesCustomer && matchesPaymentMode && matchesDateRange) {
                            row.style.display = '';
                            tableMatchCount++;
                        } else {
                            row.style.display = 'none';
                        }
                    });
                    
                    // Filter card items
                    let cardMatchCount = 0;
                    saleCards.forEach(card => {
                        const invoiceNumber = card.querySelector('.invoice-link').textContent.toLowerCase();
                        const dateStr = card.querySelector('.sale-date').textContent;
                        const customer = card.querySelector('.customer-info .info-value').textContent;
                        const paymentBadge = card.querySelector('.payment-badge');
                        const paymentMode = paymentBadge ? paymentBadge.textContent : '';
                        
                        // Parse date
                        const dateParts = dateStr.split(' ');
                        const day = parseInt(dateParts[0]);
                        const month = getMonthNumber(dateParts[1]);
                        const year = parseInt(dateParts[2]);
                        const cardDate = new Date(year, month, day);
                        
                        // Check if card matches all filters
                        const matchesSearch = invoiceNumber.includes(searchTerm);
                        const matchesCustomer = !selectedCustomer || customer === selectedCustomer;
                        const matchesPaymentMode = !selectedPaymentMode || paymentMode === selectedPaymentMode;
                        const matchesDateRange = (!fromDate || cardDate >= fromDate) && (!toDate || cardDate <= toDate);
                        
                        // Show or hide card based on filters
                        if (matchesSearch && matchesCustomer && matchesPaymentMode && matchesDateRange) {
                            card.style.display = '';
                            cardMatchCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    console.log(`Filter applied: ${tableMatchCount} table rows and ${cardMatchCount} cards match the criteria`);
                };
                
                // Helper function to convert month name to number
                function getMonthNumber(monthName) {
                    const months = {
                        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                    };
                    return months[monthName] || 0;
                }
                
                // Add event listeners to all filter inputs
                if (saleSearch) {
                    saleSearch.addEventListener('input', applyFilters);
                }
                
                if (customerFilter) {
                    customerFilter.addEventListener('change', applyFilters);
                }
                
                if (paymentModeFilter) {
                    paymentModeFilter.addEventListener('change', applyFilters);
                }
                
                if (dateFromInput) {
                    dateFromInput.addEventListener('change', applyFilters);
                }
                
                if (dateToInput) {
                    dateToInput.addEventListener('change', applyFilters);
                }
                
                console.log("Search and filters initialized");
            } catch (error) {
                console.error("Error setting up search and filters:", error);
            }
        }
        
        // Setup action buttons (view, print)
        function setupActionButtons() {
            try {
                // View buttons
                const viewButtons = document.querySelectorAll('.action-btn.view, .card-btn.view');
                viewButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Find the invoice number
                        let invoiceNumber;
                        if (this.closest('tr')) {
                            invoiceNumber = this.closest('tr').querySelector('.invoice-link').textContent;
                        } else if (this.closest('.sale-card')) {
                            invoiceNumber = this.closest('.sale-card').querySelector('.invoice-link').textContent;
                        }
                        
                        if (invoiceNumber) {
                            alert(`Viewing details for invoice ${invoiceNumber}`);
                            // In a real app, this would open a detailed view or a modal
                        }
                    });
                });
                
                // Print buttons
                const printButtons = document.querySelectorAll('.action-btn.print, .card-btn.print');
                printButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Find the invoice number
                        let invoiceNumber;
                        if (this.closest('tr')) {
                            invoiceNumber = this.closest('tr').querySelector('.invoice-link').textContent;
                        } else if (this.closest('.sale-card')) {
                            invoiceNumber = this.closest('.sale-card').querySelector('.invoice-link').textContent;
                        }
                        
                        if (invoiceNumber) {
                            alert(`Printing invoice ${invoiceNumber}`);
                            // In a real app, this would open a print dialog or generate a PDF
                        }
                    });
                });
                
                // New Sale button
                if (newSaleBtn) {
                    newSaleBtn.addEventListener('click', function() {
                        openNewSalePanel();
                    });
                }
                
                // Invoice links
                const invoiceLinks = document.querySelectorAll('.invoice-link');
                invoiceLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        alert(`Viewing details for invoice ${this.textContent}`);
                        // In a real app, this would open a detailed view of the invoice
                    });
                });
                
                console.log("Action buttons initialized");
            } catch (error) {
                console.error("Error setting up action buttons:", error);
            }
        }
        
    } catch (err) {
        console.error("Critical error initializing sales page:", err);
        alert("There was an error loading the Sales page. Please check the console for details.");
    }
    
    // New Sale Panel Functions
    
    // Open the new sale panel
    function openNewSalePanel() {
        try {
            console.log("Opening new sale panel");
            const panel = document.querySelector('.new-sale-panel');
            const overlay = document.querySelector('.panel-overlay');
            
            if (panel && overlay) {
                // Initialize the panel content
                initializeNewSalePanel();
                
                // Show the panel and overlay
                panel.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        } catch (error) {
            console.error("Error opening new sale panel:", error);
        }
    }
    
    // Close the new sale panel
    function closeNewSalePanel() {
        try {
            console.log("Closing new sale panel");
            const panel = document.querySelector('.new-sale-panel');
            const overlay = document.querySelector('.panel-overlay');
            
            if (panel && overlay) {
                panel.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        } catch (error) {
            console.error("Error closing new sale panel:", error);
        }
    }
    
    // Initialize the new sale panel
    function initializeNewSalePanel() {
        try {
            // Generate a new invoice number
            generateInvoiceNumber();
            
            // Set today's date
            const saleDateInput = document.getElementById('sale-date');
            if (saleDateInput) {
                saleDateInput.value = formatDateForInput(new Date());
                updateDatePreview(saleDateInput.value);
            }
            
            // Reset form fields
            resetNewSaleForm();
            
            // Setup event listeners for the panel
            setupNewSalePanelListeners();
            
            console.log("New sale panel initialized");
        } catch (error) {
            console.error("Error initializing new sale panel:", error);
        }
    }
    
    // Generate a new invoice number
    function generateInvoiceNumber() {
        try {
            const invoiceNumberField = document.getElementById('invoice-number');
            const invoicePreview = document.querySelector('.invoice-number-preview');
            
            // Get the latest invoice number from the table and increment it
            const invoiceNumbers = Array.from(document.querySelectorAll('.invoice-link'))
                .map(link => link.textContent.replace('INV-', ''))
                .map(Number)
                .filter(num => !isNaN(num));
            
            let maxInvoiceNumber = Math.max(...invoiceNumbers, 0);
            const newInvoiceNumber = `INV-${maxInvoiceNumber + 1}`;
            
            // Update input and preview
            if (invoiceNumberField) {
                invoiceNumberField.value = newInvoiceNumber;
            }
            
            if (invoicePreview) {
                invoicePreview.textContent = newInvoiceNumber;
            }
            
            console.log("Generated invoice number:", newInvoiceNumber);
        } catch (error) {
            console.error("Error generating invoice number:", error);
        }
    }
    
    // Reset the new sale form
    function resetNewSaleForm() {
        try {
            // Reset customer and salesperson selects
            const customerSelect = document.getElementById('customer-name');
            const salespersonSelect = document.getElementById('salesperson');
            const paymentModeSelect = document.getElementById('payment-mode');
            const taxRateInput = document.getElementById('tax-rate');
            
            if (customerSelect) customerSelect.selectedIndex = 0;
            if (salespersonSelect) salespersonSelect.selectedIndex = 0;
            if (paymentModeSelect) paymentModeSelect.selectedIndex = 0;
            if (taxRateInput) taxRateInput.value = '18';
            
            // Reset preview fields
            document.querySelector('.customer-preview').textContent = 'Not selected';
            document.querySelector('.salesperson-preview').textContent = 'Not selected';
            document.querySelector('.payment-badge-preview').textContent = '—';
            document.querySelector('.payment-badge-preview').className = 'payment-badge-preview';
            document.querySelector('.tax-rate-preview').textContent = '18';
            
            // Clear product entries
            const productEntries = document.querySelector('.product-entries');
            if (productEntries) {
                productEntries.innerHTML = '';
            }
            
            // Show no products message
            const noProductsMessage = document.querySelector('.no-products-message');
            if (noProductsMessage) {
                noProductsMessage.style.display = '';
            }
            
            // Reset products preview
            const productsPreviewList = document.querySelector('.products-preview-list');
            if (productsPreviewList) {
                productsPreviewList.innerHTML = '<p class="no-products-selected">No products selected</p>';
            }
            
            // Reset totals
            updateSaleTotals();
            
            console.log("New sale form reset");
        } catch (error) {
            console.error("Error resetting new sale form:", error);
        }
    }
    
    // Setup event listeners for the new sale panel
    function setupNewSalePanelListeners() {
        try {
            // Close button
            const closeButton = document.querySelector('.close-panel-btn');
            if (closeButton) {
                closeButton.addEventListener('click', closeNewSalePanel);
            }
            
            // Cancel button
            const cancelButton = document.querySelector('.cancel-btn');
            if (cancelButton) {
                cancelButton.addEventListener('click', closeNewSalePanel);
            }
            
            // Overlay click
            const overlay = document.querySelector('.panel-overlay');
            if (overlay) {
                overlay.addEventListener('click', closeNewSalePanel);
            }
            
            // Save button
            const saveButton = document.querySelector('.save-sale-btn');
            if (saveButton) {
                saveButton.addEventListener('click', saveSale);
            }
            
            // Date input
            const saleDateInput = document.getElementById('sale-date');
            if (saleDateInput) {
                saleDateInput.addEventListener('change', function() {
                    updateDatePreview(this.value);
                });
            }
            
            // Customer select
            const customerSelect = document.getElementById('customer-name');
            if (customerSelect) {
                customerSelect.addEventListener('change', function() {
                    const customerPreview = document.querySelector('.customer-preview');
                    if (customerPreview) {
                        customerPreview.textContent = this.value || 'Not selected';
                    }
                });
            }
            
            // Salesperson select
            const salespersonSelect = document.getElementById('salesperson');
            if (salespersonSelect) {
                salespersonSelect.addEventListener('change', function() {
                    const salespersonPreview = document.querySelector('.salesperson-preview');
                    if (salespersonPreview) {
                        salespersonPreview.textContent = this.value || 'Not selected';
                    }
                });
            }
            
            // Payment mode select
            const paymentModeSelect = document.getElementById('payment-mode');
            if (paymentModeSelect) {
                paymentModeSelect.addEventListener('change', function() {
                    const paymentBadge = document.querySelector('.payment-badge-preview');
                    if (paymentBadge) {
                        paymentBadge.textContent = this.value || '—';
                        // Reset class first
                        paymentBadge.className = 'payment-badge-preview';
                        // Add payment mode class if selected
                        if (this.value) {
                            paymentBadge.classList.add(this.value.split(' ')[0]); // Add first word as class
                        }
                    }
                });
            }
            
            // Tax rate input
            const taxRateInput = document.getElementById('tax-rate');
            if (taxRateInput) {
                taxRateInput.addEventListener('input', function() {
                    const taxRatePreview = document.querySelector('.tax-rate-preview');
                    if (taxRatePreview) {
                        taxRatePreview.textContent = this.value || '0';
                    }
                    updateSaleTotals();
                });
            }
            
            // Add product button
            const addProductBtn = document.querySelector('.add-product-btn');
            if (addProductBtn) {
                addProductBtn.addEventListener('click', addProductEntry);
            }
            
            console.log("New sale panel listeners set up");
        } catch (error) {
            console.error("Error setting up new sale panel listeners:", error);
        }
    }
    
    // Update the date preview
    function updateDatePreview(dateValue) {
        try {
            const datePreview = document.querySelector('.date-preview');
            if (datePreview) {
                if (dateValue) {
                    const date = new Date(dateValue);
                    const options = { day: 'numeric', month: 'short', year: 'numeric' };
                    datePreview.textContent = date.toLocaleDateString('en-IN', options);
                } else {
                    datePreview.textContent = 'Today';
                }
            }
        } catch (error) {
            console.error("Error updating date preview:", error);
        }
    }
    
    // Add a new product entry
    function addProductEntry() {
        try {
            // Hide no products message
            const noProductsMessage = document.querySelector('.no-products-message');
            if (noProductsMessage) {
                noProductsMessage.style.display = 'none';
            }
            
            // Get the template
            const template = document.querySelector('.product-entry-template');
            const productEntries = document.querySelector('.product-entries');
            
            if (template && productEntries) {
                // Clone the template
                const clone = template.firstElementChild.cloneNode(true);
                const productCount = productEntries.children.length + 1;
                
                // Update product number
                const header = clone.querySelector('h4');
                if (header) {
                    header.textContent = `Product ${productCount}`;
                }
                
                // Add event listeners to the new product entry
                setupProductEntryListeners(clone, productCount);
                
                // Add the clone to the product entries
                productEntries.appendChild(clone);
                
                console.log(`Added product entry #${productCount}`);
            }
        } catch (error) {
            console.error("Error adding product entry:", error);
        }
    }
    
    // Setup event listeners for a product entry
    function setupProductEntryListeners(productEntry, index) {
        try {
            // Product select
            const productSelect = productEntry.querySelector('.product-select');
            if (productSelect) {
                productSelect.addEventListener('change', function() {
                    const selectedOption = this.options[this.selectedIndex];
                    const priceInput = productEntry.querySelector('.product-price');
                    
                    if (priceInput && selectedOption.dataset.price) {
                        priceInput.value = (parseInt(selectedOption.dataset.price) / 100).toFixed(2);
                    }
                    
                    updateProductSubtotal(productEntry);
                    updateProductPreview();
                });
            }
            
            // Quantity input
            const quantityInput = productEntry.querySelector('.product-quantity');
            if (quantityInput) {
                quantityInput.addEventListener('input', function() {
                    updateProductSubtotal(productEntry);
                    updateProductPreview();
                });
            }
            
            // Price input
            const priceInput = productEntry.querySelector('.product-price');
            if (priceInput) {
                priceInput.addEventListener('input', function() {
                    updateProductSubtotal(productEntry);
                    updateProductPreview();
                });
            }
            
            // Discount input
            const discountInput = productEntry.querySelector('.product-discount');
            if (discountInput) {
                discountInput.addEventListener('input', function() {
                    updateProductSubtotal(productEntry);
                    updateProductPreview();
                });
            }
            
            // Remove button
            const removeButton = productEntry.querySelector('.remove-product-btn');
            if (removeButton) {
                removeButton.addEventListener('click', function() {
                    productEntry.remove();
                    
                    // Show no products message if there are no entries
                    const productEntries = document.querySelector('.product-entries');
                    if (productEntries && productEntries.children.length === 0) {
                        const noProductsMessage = document.querySelector('.no-products-message');
                        if (noProductsMessage) {
                            noProductsMessage.style.display = '';
                        }
                    }
                    
                    // Update product indices
                    updateProductIndices();
                    
                    // Update preview
                    updateProductPreview();
                });
            }
        } catch (error) {
            console.error("Error setting up product entry listeners:", error);
        }
    }
    
    // Update the product subtotal
    function updateProductSubtotal(productEntry) {
        try {
            const quantityInput = productEntry.querySelector('.product-quantity');
            const priceInput = productEntry.querySelector('.product-price');
            const discountInput = productEntry.querySelector('.product-discount');
            const subtotalValue = productEntry.querySelector('.subtotal-value');
            
            if (quantityInput && priceInput && discountInput && subtotalValue) {
                const quantity = parseInt(quantityInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                const discount = parseFloat(discountInput.value) || 0;
                
                const subtotal = (quantity * price) - discount;
                subtotalValue.textContent = `₹${subtotal.toFixed(2)}`;
            }
            
            // Update overall totals
            updateSaleTotals();
        } catch (error) {
            console.error("Error updating product subtotal:", error);
        }
    }
    
    // Update product indices after removal
    function updateProductIndices() {
        try {
            const productEntries = document.querySelector('.product-entries');
            if (productEntries) {
                const entries = productEntries.querySelectorAll('.product-entry');
                entries.forEach((entry, index) => {
                    const header = entry.querySelector('h4');
                    if (header) {
                        header.textContent = `Product ${index + 1}`;
                    }
                });
            }
        } catch (error) {
            console.error("Error updating product indices:", error);
        }
    }
    
    // Update the product preview
    function updateProductPreview() {
        try {
            const productEntries = document.querySelector('.product-entries');
            const previewList = document.querySelector('.products-preview-list');
            
            if (productEntries && previewList) {
                // Clear the preview
                previewList.innerHTML = '';
                
                const entries = productEntries.querySelectorAll('.product-entry');
                
                if (entries.length === 0) {
                    previewList.innerHTML = '<p class="no-products-selected">No products selected</p>';
                    return;
                }
                
                entries.forEach(entry => {
                    const productSelect = entry.querySelector('.product-select');
                    const quantityInput = entry.querySelector('.product-quantity');
                    const priceInput = entry.querySelector('.product-price');
                    const discountInput = entry.querySelector('.product-discount');
                    
                    if (productSelect && quantityInput && priceInput && discountInput) {
                        const selectedOption = productSelect.options[productSelect.selectedIndex];
                        if (selectedOption && selectedOption.value) {
                            const productName = selectedOption.text;
                            const quantity = parseInt(quantityInput.value) || 0;
                            const price = parseFloat(priceInput.value) || 0;
                            const discount = parseFloat(discountInput.value) || 0;
                            
                            const previewItem = document.createElement('div');
                            previewItem.className = 'product-preview-item';
                            previewItem.innerHTML = `
                                <div class="product-preview-name">${productName} x${quantity}</div>
                                <div class="product-preview-details">
                                    Unit: ₹${price.toFixed(2)} | Discount: ₹${discount.toFixed(2)} | Subtotal: ₹${((quantity * price) - discount).toFixed(2)}
                                </div>
                            `;
                            
                            previewList.appendChild(previewItem);
                        }
                    }
                });
            }
        } catch (error) {
            console.error("Error updating product preview:", error);
        }
    }
    
    // Update sale totals (subtotal, discount, tax, total)
    function updateSaleTotals() {
        try {
            let subtotal = 0;
            let totalDiscount = 0;
            
            // Calculate from product entries
            const productEntries = document.querySelectorAll('.product-entry');
            productEntries.forEach(entry => {
                const quantityInput = entry.querySelector('.product-quantity');
                const priceInput = entry.querySelector('.product-price');
                const discountInput = entry.querySelector('.product-discount');
                
                if (quantityInput && priceInput && discountInput) {
                    const quantity = parseInt(quantityInput.value) || 0;
                    const price = parseFloat(priceInput.value) || 0;
                    const discount = parseFloat(discountInput.value) || 0;
                    
                    subtotal += (quantity * price);
                    totalDiscount += discount;
                }
            });
            
            // Get tax rate
            const taxRateInput = document.getElementById('tax-rate');
            const taxRate = taxRateInput ? (parseFloat(taxRateInput.value) || 0) : 0;
            
            // Calculate tax and total
            const taxAmount = (subtotal - totalDiscount) * (taxRate / 100);
            const totalAmount = (subtotal - totalDiscount) + taxAmount;
            
            // Update preview
            const subtotalPreview = document.querySelector('.subtotal-preview');
            const discountPreview = document.querySelector('.discount-preview');
            const taxPreview = document.querySelector('.tax-preview');
            const totalPreview = document.querySelector('.total-preview');
            
            if (subtotalPreview) subtotalPreview.textContent = `₹${subtotal.toFixed(2)}`;
            if (discountPreview) discountPreview.textContent = `-₹${totalDiscount.toFixed(2)}`;
            if (taxPreview) taxPreview.textContent = `+₹${taxAmount.toFixed(2)}`;
            if (totalPreview) totalPreview.textContent = `₹${totalAmount.toFixed(2)}`;
            
        } catch (error) {
            console.error("Error updating sale totals:", error);
        }
    }
    
    // Save the sale
    function saveSale() {
        try {
            // Validate required fields
            const customerSelect = document.getElementById('customer-name');
            const paymentModeSelect = document.getElementById('payment-mode');
            const productEntries = document.querySelector('.product-entries');
            
            if (!customerSelect.value) {
                alert('Please select a customer');
                return;
            }
            
            if (!paymentModeSelect.value) {
                alert('Please select a payment mode');
                return;
            }
            
            if (!productEntries.children.length) {
                alert('Please add at least one product');
                return;
            }
            
            // Get form values
            const invoiceNumber = document.getElementById('invoice-number').value;
            const saleDate = document.getElementById('sale-date').value;
            const customer = customerSelect.value;
            const salesperson = document.getElementById('salesperson').value || 'Not assigned';
            const paymentMode = paymentModeSelect.value;
            const taxRate = document.getElementById('tax-rate').value;
            
            // Get totals
            const subtotalEl = document.querySelector('.subtotal-preview');
            const discountEl = document.querySelector('.discount-preview');
            const taxEl = document.querySelector('.tax-preview');
            const totalEl = document.querySelector('.total-preview');
            
            const subtotal = subtotalEl.textContent;
            const discount = discountEl.textContent;
            const tax = taxEl.textContent;
            const total = totalEl.textContent;
            
            // Get products
            const products = [];
            const productElems = productEntries.querySelectorAll('.product-entry');
            productElems.forEach(elem => {
                const productSelect = elem.querySelector('.product-select');
                const quantityInput = elem.querySelector('.product-quantity');
                const selectedOption = productSelect.options[productSelect.selectedIndex];
                
                if (selectedOption && selectedOption.value && quantityInput) {
                    products.push({
                        id: selectedOption.value,
                        name: selectedOption.text,
                        quantity: quantityInput.value
                    });
                }
            });
            
            // For demonstration, log the sale data and display success message
            console.log('Sale saved:', {
                invoiceNumber,
                date: saleDate,
                customer,
                salesperson,
                paymentMode,
                taxRate,
                products,
                subtotal,
                discount,
                tax,
                total
            });
            
            // Show success message
            alert('Sale saved successfully!');
            
            // Close the panel
            closeNewSalePanel();
            
            // In a real app, you would add the sale to the table/cards
            // For demo, we'll reload the page
            setTimeout(() => {
                location.reload();
            }, 1000);
            
        } catch (error) {
            console.error("Error saving sale:", error);
            alert('There was an error saving the sale. Please try again.');
        }
    }
});

// Add event listener for sidebar Sales link when on other pages
// This ensures we properly navigate to the sales page
if (!window.location.pathname.includes('sales.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log("Setting up Sales link handler on non-sales page");
            const salesLink = document.querySelector('.sidebar-menu li a[href="sales.html"]');
            
            if (salesLink) {
                console.log("Sales link found, adding click handler");
                salesLink.addEventListener('click', function(e) {
                    console.log("Sales link clicked, navigating to sales.html");
                    // Store this click in sessionStorage so we can detect if we came from a click
                    sessionStorage.setItem('salesLinkClicked', 'true');
                });
            } else {
                console.error("Sales link not found in sidebar!");
            }
        } catch (err) {
            console.error("Error setting up Sales link:", err);
        }
    });
} 