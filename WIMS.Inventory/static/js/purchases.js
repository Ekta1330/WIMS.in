// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Purchases page loaded - initializing");
    
    try {
        // Fetch elements
        const purchaseSearch = document.getElementById('purchase-search');
        const supplierFilter = document.getElementById('supplier-filter');
        const statusFilter = document.getElementById('status-filter');
        const dateFromFilter = document.getElementById('date-from');
        const dateToFilter = document.getElementById('date-to');
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const viewContainers = document.querySelectorAll('.view-container');
        const purchaseTable = document.querySelector('.purchase-table');
        const newPurchaseBtn = document.querySelector('.new-purchase-btn');
        const purchasePanel = document.querySelector('.new-purchase-panel');
        const panelOverlay = document.querySelector('.panel-overlay');
        
        // Log whether elements were found
        console.log("Elements found:", {
            purchaseSearch: !!purchaseSearch,
            supplierFilter: !!supplierFilter,
            statusFilter: !!statusFilter,
            dateFromFilter: !!dateFromFilter,
            dateToFilter: !!dateToFilter,
            toggleBtns: toggleBtns.length,
            viewContainers: viewContainers.length,
            purchaseTable: !!purchaseTable,
            newPurchaseBtn: !!newPurchaseBtn,
            purchasePanel: !!purchasePanel,
            panelOverlay: !!panelOverlay
        });
        
        // Make sure sidebar Purchase link is active
        activateSidebarLink();
        
        // Setup view toggle (table/card view)
        setupViewToggle();
        
        // Setup product toggle buttons
        setupToggles();
        
        // Setup search and filter functionality
        setupSearchAndFilters();
        
        // Setup action buttons
        setupActionButtons();
        
        // Setup the new purchase panel
        setupNewPurchasePanel();
        
        // Log successful initialization
        console.log("Purchases page initialization complete");
        
        // Make sure sidebar Purchase link is marked as active
        function activateSidebarLink() {
            try {
                // Find the Purchase link in the sidebar and ensure it's active
                const sidebarItems = document.querySelectorAll('.sidebar-menu li');
                sidebarItems.forEach(item => {
                    // Remove active from all
                    item.classList.remove('active');
                    
                    // Check if this is the Purchase link
                    const link = item.querySelector('a');
                    if (link && link.getAttribute('href') === 'purchases.html') {
                        item.classList.add('active');
                        console.log("Purchase sidebar link activated");
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
        
        // Setup products toggle buttons
        function setupToggles() {
            try {
                // Products toggle buttons in table view
                const productsToggleBtns = document.querySelectorAll('.products-toggle');
                productsToggleBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productsDetails = this.nextElementSibling;
                        productsDetails.classList.toggle('show');
                        this.textContent = productsDetails.classList.contains('show') ? 'Hide Products' : 'View Products';
                    });
                });
                
                console.log("Toggle buttons initialized");
            } catch (error) {
                console.error("Error setting up toggle buttons:", error);
            }
        }
        
        // Setup search and filter functionality
        function setupSearchAndFilters() {
            try {
                // Get all table rows and card items
                const tableRows = purchaseTable ? purchaseTable.querySelectorAll('tbody tr') : [];
                const purchaseCards = document.querySelectorAll('.purchase-card');
                
                // Function to apply filters
                const applyFilters = () => {
                    const searchTerm = purchaseSearch ? purchaseSearch.value.toLowerCase() : '';
                    const selectedSupplier = supplierFilter ? supplierFilter.value.toLowerCase() : '';
                    const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : '';
                    const fromDate = dateFromFilter ? new Date(dateFromFilter.value) : null;
                    const toDate = dateToFilter ? new Date(dateToFilter.value) : null;
                    
                    // Filter table rows
                    let tableMatchCount = 0;
                    tableRows.forEach(row => {
                        const invoiceNo = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                        const supplier = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                        
                        // Get date
                        const dateCell = row.querySelector('td:nth-child(2)').textContent;
                        const dateParts = dateCell.split(' ');
                        const rowDate = new Date(`${dateParts[1]} ${dateParts[0]}, ${dateParts[2]}`);
                        
                        // Get status
                        const statusBadge = row.querySelector('.status-badge');
                        const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                        
                        // Check if row matches all filters
                        const matchesSearch = invoiceNo.includes(searchTerm);
                        const matchesSupplier = !selectedSupplier || supplier.toLowerCase().includes(selectedSupplier);
                        const matchesStatus = !selectedStatus || status === selectedStatus;
                        
                        // Date range filter
                        let matchesDateRange = true;
                        if (fromDate && !isNaN(fromDate.getTime())) {
                            matchesDateRange = matchesDateRange && rowDate >= fromDate;
                        }
                        if (toDate && !isNaN(toDate.getTime())) {
                            matchesDateRange = matchesDateRange && rowDate <= toDate;
                        }
                        
                        // Show or hide row based on filters
                        if (matchesSearch && matchesSupplier && matchesStatus && matchesDateRange) {
                            row.style.display = '';
                            tableMatchCount++;
                        } else {
                            row.style.display = 'none';
                        }
                    });
                    
                    // Filter card items
                    let cardMatchCount = 0;
                    purchaseCards.forEach(card => {
                        const invoiceNo = card.querySelector('.invoice-info h3').textContent.toLowerCase();
                        const supplier = card.querySelector('.supplier-info .info-value').textContent.toLowerCase();
                        
                        // Get date
                        const dateText = card.querySelector('.purchase-date').textContent;
                        const dateParts = dateText.split(' ');
                        const cardDate = new Date(`${dateParts[1]} ${dateParts[0]}, ${dateParts[2]}`);
                        
                        // Get status
                        const statusBadge = card.querySelector('.status-badge');
                        const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                        
                        // Check if card matches all filters
                        const matchesSearch = invoiceNo.includes(searchTerm);
                        const matchesSupplier = !selectedSupplier || supplier.toLowerCase().includes(selectedSupplier);
                        const matchesStatus = !selectedStatus || status === selectedStatus;
                        
                        // Date range filter
                        let matchesDateRange = true;
                        if (fromDate && !isNaN(fromDate.getTime())) {
                            matchesDateRange = matchesDateRange && cardDate >= fromDate;
                        }
                        if (toDate && !isNaN(toDate.getTime())) {
                            matchesDateRange = matchesDateRange && cardDate <= toDate;
                        }
                        
                        // Show or hide card based on filters
                        if (matchesSearch && matchesSupplier && matchesStatus && matchesDateRange) {
                            card.style.display = '';
                            cardMatchCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    console.log(`Filter applied: ${tableMatchCount} table rows and ${cardMatchCount} cards match`);
                };
                
                // Add event listeners to all filter inputs
                if (purchaseSearch) purchaseSearch.addEventListener('input', applyFilters);
                if (supplierFilter) supplierFilter.addEventListener('change', applyFilters);
                if (statusFilter) statusFilter.addEventListener('change', applyFilters);
                if (dateFromFilter) dateFromFilter.addEventListener('change', applyFilters);
                if (dateToFilter) dateToFilter.addEventListener('change', applyFilters);
                
                console.log("Search and filters initialized");
            } catch (error) {
                console.error("Error setting up search and filters:", error);
            }
        }
        
        // Setup action buttons
        function setupActionButtons() {
            try {
                // View buttons in table
                const viewButtons = document.querySelectorAll('.action-btn.view, .card-btn.view');
                viewButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const row = this.closest('tr') || this.closest('.purchase-card');
                        const invoiceNo = row.querySelector('.invoice-link') ? 
                            row.querySelector('.invoice-link').textContent : 
                            'Unknown Invoice';
                        
                        alert(`Viewing details for ${invoiceNo}`);
                        // In a real implementation, this would open a detailed view
                    });
                });
                
                // Print buttons
                const printButtons = document.querySelectorAll('.action-btn.print, .card-btn.print');
                printButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const row = this.closest('tr') || this.closest('.purchase-card');
                        const invoiceNo = row.querySelector('.invoice-link') ? 
                            row.querySelector('.invoice-link').textContent : 
                            'Unknown Invoice';
                        
                        alert(`Printing invoice ${invoiceNo}`);
                        // In a real implementation, this would trigger a print function
                    });
                });
                
                console.log("Action buttons initialized");
            } catch (error) {
                console.error("Error setting up action buttons:", error);
            }
        }
        
        // Setup the new purchase order panel
        function setupNewPurchasePanel() {
            try {
                // Panel elements
                const closeBtn = document.querySelector('.close-panel-btn');
                const cancelBtn = document.querySelector('.cancel-btn');
                const savePurchaseBtn = document.querySelector('.save-purchase-btn');
                const addProductBtn = document.querySelector('.add-product-btn');
                const productsContainer = document.querySelector('.products-container');
                const productEntriesContainer = document.querySelector('.product-entries');
                const noProductsMessage = document.querySelector('.no-products-message');
                const productTemplate = document.querySelector('.product-entry-template');
                
                // Form inputs
                const invoiceNumberInput = document.getElementById('invoice-number');
                const purchaseDateInput = document.getElementById('purchase-date');
                const supplierNameSelect = document.getElementById('supplier-name');
                const paymentModeSelect = document.getElementById('payment-mode');
                const paymentStatusSelect = document.getElementById('payment-status');
                const taxRateInput = document.getElementById('tax-rate');
                
                // Preview elements
                const invoiceNumberPreview = document.querySelector('.invoice-number-preview');
                const datePreview = document.querySelector('.date-preview');
                const supplierPreview = document.querySelector('.supplier-preview');
                const productsPreviewList = document.querySelector('.products-preview-list');
                const noProductsSelected = document.querySelector('.no-products-selected');
                const subtotalPreview = document.querySelector('.subtotal-preview');
                const taxRatePreview = document.querySelector('.tax-rate-preview');
                const taxPreview = document.querySelector('.tax-preview');
                const totalPreview = document.querySelector('.total-preview');
                const paymentModePreview = document.querySelector('.payment-mode-preview');
                const statusBadgePreview = document.querySelector('.status-badge-preview');
                
                // Set today's date as default
                if (purchaseDateInput) {
                    const today = new Date();
                    purchaseDateInput.value = today.toISOString().split('T')[0];
                    datePreview.textContent = today.toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
                
                // Generate invoice number
                if (invoiceNumberInput) {
                    const newInvoiceNumber = generateInvoiceNumber();
                    invoiceNumberInput.value = newInvoiceNumber;
                    invoiceNumberPreview.textContent = newInvoiceNumber;
                }
                
                // Event listeners for panel open/close
                if (newPurchaseBtn) {
                    newPurchaseBtn.addEventListener('click', openNewPurchasePanel);
                }
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', closeNewPurchasePanel);
                }
                
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', closeNewPurchasePanel);
                }
                
                if (panelOverlay) {
                    panelOverlay.addEventListener('click', closeNewPurchasePanel);
                }
                
                // Event listener for adding product
                if (addProductBtn) {
                    addProductBtn.addEventListener('click', addProductEntry);
                }
                
                // Event listener for save button
                if (savePurchaseBtn) {
                    savePurchaseBtn.addEventListener('click', savePurchase);
                }
                
                // Event listeners for form inputs for preview updates
                if (purchaseDateInput) {
                    purchaseDateInput.addEventListener('change', updatePreview);
                }
                
                if (supplierNameSelect) {
                    supplierNameSelect.addEventListener('change', updatePreview);
                }
                
                if (paymentModeSelect) {
                    paymentModeSelect.addEventListener('change', updatePreview);
                }
                
                if (paymentStatusSelect) {
                    paymentStatusSelect.addEventListener('change', updatePreview);
                }
                
                if (taxRateInput) {
                    taxRateInput.addEventListener('input', updatePreview);
                }
                
                function openNewPurchasePanel() {
                    purchasePanel.classList.add('open');
                    panelOverlay.classList.add('active');
                    resetForm();
                    console.log("New purchase panel opened");
                }
                
                function closeNewPurchasePanel() {
                    purchasePanel.classList.remove('open');
                    panelOverlay.classList.remove('active');
                    console.log("Purchase panel closed");
                }
                
                function resetForm() {
                    // Reset all form fields
                    if (purchaseDateInput) {
                        const today = new Date();
                        purchaseDateInput.value = today.toISOString().split('T')[0];
                    }
                    
                    if (supplierNameSelect) supplierNameSelect.selectedIndex = 0;
                    if (paymentModeSelect) paymentModeSelect.selectedIndex = 0;
                    if (paymentStatusSelect) paymentStatusSelect.selectedIndex = 0;
                    if (taxRateInput) taxRateInput.value = 18;
                    
                    // Clear product entries
                    if (productEntriesContainer) productEntriesContainer.innerHTML = '';
                    if (noProductsMessage) noProductsMessage.style.display = 'block';
                    
                    // Reset preview
                    updatePreview();
                    
                    // Generate new invoice number
                    const newInvoiceNumber = generateInvoiceNumber();
                    if (invoiceNumberInput) invoiceNumberInput.value = newInvoiceNumber;
                    if (invoiceNumberPreview) invoiceNumberPreview.textContent = newInvoiceNumber;
                    
                    console.log("Form reset");
                }
                
                function generateInvoiceNumber() {
                    // Generate a new unique invoice number (PO-XXXXX)
                    const randomNum = Math.floor(10000 + Math.random() * 90000);
                    return `PO-${randomNum}`;
                }
                
                function addProductEntry() {
                    if (!productTemplate || !productEntriesContainer) return;
                    
                    // Hide no products message
                    if (noProductsMessage) noProductsMessage.style.display = 'none';
                    
                    // Clone the template
                    const template = productTemplate.firstElementChild.cloneNode(true);
                    
                    // Update product number
                    const productCount = productEntriesContainer.children.length + 1;
                    const headerElement = template.querySelector('h4');
                    if (headerElement) {
                        headerElement.textContent = `Product ${productCount}`;
                    }
                    
                    // Add event listeners
                    const removeBtn = template.querySelector('.remove-product-btn');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', function() {
                            template.remove();
                            
                            // Update product numbers
                            updateProductNumbers();
                            
                            // Show no products message if no products are left
                            if (productEntriesContainer.children.length === 0 && noProductsMessage) {
                                noProductsMessage.style.display = 'block';
                            }
                            
                            // Update preview
                            updatePreview();
                        });
                    }
                    
                    // Add event listeners for product selection and quantity/price changes
                    const productSelect = template.querySelector('.product-select');
                    const quantityInput = template.querySelector('.product-quantity');
                    const priceInput = template.querySelector('.product-price');
                    
                    if (productSelect) {
                        productSelect.addEventListener('change', function() {
                            // Update price when product is selected
                            if (priceInput) {
                                const selectedOption = this.options[this.selectedIndex];
                                const price = selectedOption.getAttribute('data-price') || 0;
                                priceInput.value = price;
                            }
                            updateProductSubtotal(template);
                            updatePreview();
                        });
                    }
                    
                    if (quantityInput) {
                        quantityInput.addEventListener('input', function() {
                            updateProductSubtotal(template);
                            updatePreview();
                        });
                    }
                    
                    if (priceInput) {
                        priceInput.addEventListener('input', function() {
                            updateProductSubtotal(template);
                            updatePreview();
                        });
                    }
                    
                    // Add to container
                    productEntriesContainer.appendChild(template);
                    
                    // Call update functions
                    updateProductSubtotal(template);
                    updatePreview();
                    
                    console.log(`Product entry ${productCount} added`);
                }
                
                function updateProductNumbers() {
                    const productEntries = productEntriesContainer.querySelectorAll('.product-entry');
                    productEntries.forEach((entry, index) => {
                        const headerElement = entry.querySelector('h4');
                        if (headerElement) {
                            headerElement.textContent = `Product ${index + 1}`;
                        }
                    });
                }
                
                function updateProductSubtotal(productEntry) {
                    const quantityInput = productEntry.querySelector('.product-quantity');
                    const priceInput = productEntry.querySelector('.product-price');
                    const subtotalElement = productEntry.querySelector('.subtotal-value');
                    
                    if (quantityInput && priceInput && subtotalElement) {
                        const quantity = parseFloat(quantityInput.value) || 0;
                        const price = parseFloat(priceInput.value) || 0;
                        const subtotal = quantity * price;
                        
                        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
                    }
                }
                
                function updatePreview() {
                    // Update date
                    if (purchaseDateInput && datePreview) {
                        if (purchaseDateInput.value) {
                            const date = new Date(purchaseDateInput.value);
                            datePreview.textContent = date.toLocaleDateString('en-IN', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            });
                        } else {
                            datePreview.textContent = 'Not selected';
                        }
                    }
                    
                    // Update supplier
                    if (supplierNameSelect && supplierPreview) {
                        supplierPreview.textContent = supplierNameSelect.value || 'Not selected';
                    }
                    
                    // Update products preview
                    if (productsPreviewList && noProductsSelected) {
                        const productEntries = productEntriesContainer.querySelectorAll('.product-entry');
                        
                        if (productEntries.length === 0) {
                            // No products selected
                            productsPreviewList.innerHTML = '';
                            noProductsSelected.style.display = 'block';
                        } else {
                            // Products selected
                            noProductsSelected.style.display = 'none';
                            productsPreviewList.innerHTML = '';
                            
                            let subtotalSum = 0;
                            
                            productEntries.forEach(entry => {
                                const productSelect = entry.querySelector('.product-select');
                                const quantityInput = entry.querySelector('.product-quantity');
                                
                                if (productSelect && quantityInput) {
                                    const selectedOption = productSelect.options[productSelect.selectedIndex];
                                    const productName = selectedOption.getAttribute('data-name') || 'Unknown Product';
                                    const quantity = parseFloat(quantityInput.value) || 0;
                                    const price = parseFloat(entry.querySelector('.product-price').value) || 0;
                                    
                                    // Calculate this product's subtotal
                                    const itemSubtotal = quantity * price;
                                    subtotalSum += itemSubtotal;
                                    
                                    // Add product to preview list
                                    if (productName !== 'Unknown Product') {
                                        const productListItem = document.createElement('p');
                                        productListItem.textContent = `${productName} x${quantity} (₹${price} each)`;
                                        productsPreviewList.appendChild(productListItem);
                                    }
                                }
                            });
                            
                            // Update subtotal, tax and total
                            if (subtotalPreview) {
                                subtotalPreview.textContent = `₹${subtotalSum.toFixed(2)}`;
                            }
                            
                            if (taxRateInput && taxRatePreview && taxPreview && totalPreview) {
                                const taxRate = parseFloat(taxRateInput.value) || 0;
                                taxRatePreview.textContent = taxRate;
                                
                                const taxAmount = (subtotalSum * taxRate) / 100;
                                taxPreview.textContent = `+₹${taxAmount.toFixed(2)}`;
                                
                                const totalAmount = subtotalSum + taxAmount;
                                totalPreview.textContent = `₹${totalAmount.toFixed(2)}`;
                            }
                        }
                    }
                    
                    // Update payment mode
                    if (paymentModeSelect && paymentModePreview) {
                        paymentModePreview.textContent = paymentModeSelect.value || 'Not selected';
                    }
                    
                    // Update status badge
                    if (paymentStatusSelect && statusBadgePreview) {
                        const status = paymentStatusSelect.value;
                        statusBadgePreview.textContent = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';
                        statusBadgePreview.className = 'status-badge-preview';
                        if (status) statusBadgePreview.classList.add(status);
                    }
                }
                
                function savePurchase(event) {
                    event.preventDefault();
                    
                    // Validate form
                    let isValid = true;
                    let errorMessage = '';
                    
                    if (!supplierNameSelect.value) {
                        isValid = false;
                        errorMessage += 'Please select a supplier.\n';
                    }
                    
                    if (productEntriesContainer.children.length === 0) {
                        isValid = false;
                        errorMessage += 'Please add at least one product.\n';
                    }
                    
                    if (!paymentModeSelect.value) {
                        isValid = false;
                        errorMessage += 'Please select a payment mode.\n';
                    }
                    
                    if (!paymentStatusSelect.value) {
                        isValid = false;
                        errorMessage += 'Please select a payment status.\n';
                    }
                    
                    // Check if products are properly selected
                    const productEntries = productEntriesContainer.querySelectorAll('.product-entry');
                    productEntries.forEach((entry, index) => {
                        const productSelect = entry.querySelector('.product-select');
                        const quantityInput = entry.querySelector('.product-quantity');
                        
                        if (!productSelect.value) {
                            isValid = false;
                            errorMessage += `Please select a product for Product ${index + 1}.\n`;
                        }
                        
                        if (parseFloat(quantityInput.value) <= 0) {
                            isValid = false;
                            errorMessage += `Please enter a valid quantity for Product ${index + 1}.\n`;
                        }
                    });
                    
                    if (!isValid) {
                        alert('Please correct the following errors:\n\n' + errorMessage);
                        return;
                    }
                    
                    // In a real implementation, this would save the purchase to the database
                    alert('Purchase order saved successfully!');
                    
                    // Close panel and reset form
                    closeNewPurchasePanel();
                    
                    console.log("Purchase saved");
                }
                
                console.log("Purchase order panel initialized");
            } catch (error) {
                console.error("Error setting up purchase order panel:", error);
            }
        }
        
    } catch (error) {
        console.error("Error initializing purchases page:", error);
    }
}); 