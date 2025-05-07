// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Suppliers page loaded - initializing");
    
    try {
        // Fetch elements
        const supplierSearch = document.getElementById('supplier-search');
        const categoryFilter = document.getElementById('product-category-filter');
        const statusFilter = document.getElementById('status-filter');
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const viewContainers = document.querySelectorAll('.view-container');
        const supplierTable = document.querySelector('.supplier-table');
        const addSupplierBtn = document.querySelector('.add-supplier-btn');
        
        // Log whether elements were found
        console.log("Elements found:", {
            supplierSearch: !!supplierSearch,
            categoryFilter: !!categoryFilter,
            statusFilter: !!statusFilter,
            toggleBtns: toggleBtns.length,
            viewContainers: viewContainers.length,
            supplierTable: !!supplierTable,
            addSupplierBtn: !!addSupplierBtn
        });
        
        // Make sure sidebar Supplier link is active
        activateSidebarLink();
        
        // Setup view toggle (table/card view)
        setupViewToggle();
        
        // Setup address and products toggle buttons
        setupToggles();
        
        // Setup search and filter functionality
        setupSearchAndFilters();
        
        // Setup action buttons
        setupActionButtons();
        
        // Setup the new supplier panel
        setupAddSupplierPanel();
        
        // Log successful initialization
        console.log("Suppliers page initialization complete");
        
        // Make sure sidebar Supplier link is marked as active
        function activateSidebarLink() {
            try {
                // Find the Supplier link in the sidebar and ensure it's active
                const sidebarItems = document.querySelectorAll('.sidebar-menu li');
                sidebarItems.forEach(item => {
                    // Remove active from all
                    item.classList.remove('active');
                    
                    // Check if this is the Supplier link
                    const link = item.querySelector('a');
                    if (link && link.getAttribute('href') === 'suppliers.html') {
                        item.classList.add('active');
                        console.log("Supplier sidebar link activated");
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
        
        // Setup address and products toggle buttons
        function setupToggles() {
            try {
                // Table view toggles
                const addressToggleBtns = document.querySelectorAll('.address-toggle');
                addressToggleBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const addressDetails = this.nextElementSibling;
                        addressDetails.classList.toggle('show');
                        this.textContent = addressDetails.classList.contains('show') ? 'Hide Address' : 'View Address';
                    });
                });
                
                const productsToggleBtns = document.querySelectorAll('.products-toggle');
                productsToggleBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productsDetails = this.nextElementSibling;
                        productsDetails.classList.toggle('show');
                        this.textContent = productsDetails.classList.contains('show') ? 'Hide Products' : 'View Products';
                    });
                });
                
                // Card view address previews
                const addressPreviews = document.querySelectorAll('.address-preview');
                addressPreviews.forEach(preview => {
                    preview.addEventListener('click', function() {
                        const fullAddress = this.nextElementSibling;
                        fullAddress.classList.toggle('show');
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
                const tableRows = supplierTable ? supplierTable.querySelectorAll('tbody tr') : [];
                const supplierCards = document.querySelectorAll('.supplier-card');
                
                // Function to apply filters
                const applyFilters = () => {
                    const searchTerm = supplierSearch ? supplierSearch.value.toLowerCase() : '';
                    const selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase() : '';
                    const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : '';
                    
                    // Filter table rows
                    let tableMatchCount = 0;
                    tableRows.forEach(row => {
                        const supplierName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        const companyName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                        const email = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                        
                        // Get products (inside the hidden div)
                        const productsDetails = row.querySelector('.products-details');
                        const productsText = productsDetails ? productsDetails.textContent.toLowerCase() : '';
                        
                        // Get status
                        const statusBadge = row.querySelector('.status-badge');
                        const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                        
                        // Check if row matches all filters
                        const matchesSearch = supplierName.includes(searchTerm) || 
                                             companyName.includes(searchTerm) || 
                                             email.includes(searchTerm);
                        
                        const matchesCategory = !selectedCategory || productsText.includes(selectedCategory);
                        const matchesStatus = !selectedStatus || status === selectedStatus;
                        
                        // Show or hide row based on filters
                        if (matchesSearch && matchesCategory && matchesStatus) {
                            row.style.display = '';
                            tableMatchCount++;
                        } else {
                            row.style.display = 'none';
                        }
                    });
                    
                    // Filter card items
                    let cardMatchCount = 0;
                    supplierCards.forEach(card => {
                        const supplierName = card.querySelector('.supplier-name h3').textContent.toLowerCase();
                        const companyName = card.querySelector('.company-info .info-value').textContent.toLowerCase();
                        const email = card.querySelector('.info-item:nth-child(2) .info-value').textContent.toLowerCase();
                        
                        // Get products
                        const productsList = card.querySelector('.products-list');
                        const productsText = productsList ? productsList.textContent.toLowerCase() : '';
                        
                        // Get status
                        const statusBadge = card.querySelector('.status-badge');
                        const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';
                        
                        // Check if card matches all filters
                        const matchesSearch = supplierName.includes(searchTerm) || 
                                             companyName.includes(searchTerm) || 
                                             email.includes(searchTerm);
                                             
                        const matchesCategory = !selectedCategory || productsText.includes(selectedCategory);
                        const matchesStatus = !selectedStatus || status === selectedStatus;
                        
                        // Show or hide card based on filters
                        if (matchesSearch && matchesCategory && matchesStatus) {
                            card.style.display = '';
                            cardMatchCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    console.log(`Filter applied: ${tableMatchCount} table rows and ${cardMatchCount} cards match the criteria`);
                };
                
                // Add event listeners to all filter inputs
                if (supplierSearch) {
                    supplierSearch.addEventListener('input', applyFilters);
                }
                
                if (categoryFilter) {
                    categoryFilter.addEventListener('change', applyFilters);
                }
                
                if (statusFilter) {
                    statusFilter.addEventListener('change', applyFilters);
                }
                
                console.log("Search and filters initialized");
            } catch (error) {
                console.error("Error setting up search and filters:", error);
            }
        }
        
        // Setup action buttons (view, edit)
        function setupActionButtons() {
            try {
                // Table view buttons
                const viewButtons = document.querySelectorAll('.action-btn.view');
                viewButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Get the supplier ID from the row
                        const row = this.closest('tr');
                        const supplierId = row.querySelector('td:first-child').textContent;
                        const supplierName = row.querySelector('td:nth-child(2)').textContent;
                        
                        // Show a message (in a real app, would open a detailed view)
                        alert(`Viewing supplier details for ${supplierName} (${supplierId})`);
                    });
                });
                
                const editButtons = document.querySelectorAll('.action-btn.edit');
                editButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Get the supplier ID from the row
                        const row = this.closest('tr');
                        const supplierId = row.querySelector('td:first-child').textContent;
                        const supplierName = row.querySelector('td:nth-child(2)').textContent;
                        
                        // Show a message (in a real app, would open an edit form)
                        alert(`Editing supplier ${supplierName} (${supplierId})`);
                    });
                });
                
                // Card view buttons
                const cardViewButtons = document.querySelectorAll('.card-btn.view');
                cardViewButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Get the supplier ID from the card
                        const card = this.closest('.supplier-card');
                        const supplierId = card.querySelector('.supplier-id').textContent;
                        const supplierName = card.querySelector('.supplier-name h3').textContent;
                        
                        // Show a message (in a real app, would open a detailed view)
                        alert(`Viewing supplier details for ${supplierName} (${supplierId})`);
                    });
                });
                
                const cardEditButtons = document.querySelectorAll('.card-btn.edit');
                cardEditButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Get the supplier ID from the card
                        const card = this.closest('.supplier-card');
                        const supplierId = card.querySelector('.supplier-id').textContent;
                        const supplierName = card.querySelector('.supplier-name h3').textContent;
                        
                        // Show a message (in a real app, would open an edit form)
                        alert(`Editing supplier ${supplierName} (${supplierId})`);
                    });
                });
                
                console.log("Action buttons initialized");
            } catch (error) {
                console.error("Error setting up action buttons:", error);
            }
        }
        
        // Setup the add supplier panel and its functionality
        function setupAddSupplierPanel() {
            try {
                const addSupplierButton = document.querySelector('.add-supplier-btn');
                const addSupplierPanel = document.querySelector('.add-supplier-panel');
                const closeButton = document.querySelector('.close-panel-btn');
                const cancelButton = document.querySelector('.cancel-btn');
                const overlay = document.querySelector('.panel-overlay');
                const addProductBtn = document.querySelector('.product-supply-container .add-product-btn');
                const generateIdBtn = document.querySelector('.generate-id-btn');
                const supplierForm = document.getElementById('add-supplier-form');
                
                // Open panel function
                function openAddSupplierPanel() {
                    addSupplierPanel.classList.add('active');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                    generateSupplierId(); // Generate a new supplier ID
                }
                
                // Close panel function
                function closeAddSupplierPanel() {
                    addSupplierPanel.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = ''; // Re-enable scrolling
                    resetForm(); // Reset form fields
                }
                
                // Reset form function
                function resetForm() {
                    supplierForm.reset();
                    
                    // Remove all product entries
                    const productEntries = document.querySelector('.product-supply-list');
                    if (productEntries) {
                        productEntries.innerHTML = '';
                    }
                }
                
                // Generate supplier ID function
                function generateSupplierId() {
                    const supplierIdField = document.getElementById('supplier-id');
                    if (supplierIdField) {
                        // Get existing supplier IDs from the table
                        const existingIds = Array.from(document.querySelectorAll('td:first-child, .supplier-id'))
                            .map(el => el.textContent)
                            .filter(id => id.startsWith('SUP-'))
                            .map(id => parseInt(id.replace('SUP-', '')))
                            .filter(num => !isNaN(num));
                        
                        // Generate a new ID
                        const maxId = Math.max(...existingIds, 0);
                        const newId = `SUP-${String(maxId + 1).padStart(3, '0')}`;
                        
                        supplierIdField.value = newId;
                    }
                }
                
                // Add product entry function
                function addProductEntry() {
                    const template = document.querySelector('.product-entry-template');
                    const productList = document.querySelector('.product-supply-list');
                    
                    if (template && productList) {
                        // Clone the template
                        const clone = template.firstElementChild.cloneNode(true);
                        
                        // Add event listener to remove button
                        const removeBtn = clone.querySelector('.remove-product-btn');
                        if (removeBtn) {
                            removeBtn.addEventListener('click', function() {
                                clone.remove();
                            });
                        }
                        
                        // Add to the list
                        productList.appendChild(clone);
                    }
                }
                
                // Save supplier function
                function saveSupplier(event) {
                    event.preventDefault();
                    
                    // Validate form
                    const supplierName = document.getElementById('supplier-name').value;
                    const companyName = document.getElementById('company-name').value;
                    const supplierContact = document.getElementById('supplier-contact').value;
                    const supplierEmail = document.getElementById('supplier-email').value;
                    
                    if (!supplierName) {
                        alert('Please enter the supplier name');
                        return;
                    }
                    
                    if (!companyName) {
                        alert('Please enter the company name');
                        return;
                    }
                    
                    if (!supplierContact) {
                        alert('Please enter a contact number');
                        return;
                    }
                    
                    if (!supplierEmail) {
                        alert('Please enter an email address');
                        return;
                    }
                    
                    // Get all form data
                    const formData = {
                        id: document.getElementById('supplier-id').value,
                        status: document.getElementById('supplier-status').value,
                        name: supplierName,
                        company: companyName,
                        contact: supplierContact,
                        email: supplierEmail,
                        address: document.getElementById('supplier-address').value,
                        gstin: document.getElementById('gstin').value,
                        creditTerms: document.getElementById('credit-terms').value,
                        outstandingBalance: document.getElementById('outstanding-balance').value || '0.00',
                        products: []
                    };
                    
                    // Get all product entries
                    const productSelects = document.querySelectorAll('.product-supply-list .product-select');
                    productSelects.forEach(select => {
                        if (select.value) {
                            formData.products.push({
                                id: select.value,
                                name: select.options[select.selectedIndex].text
                            });
                        }
                    });
                    
                    console.log('Supplier data to save:', formData);
                    
                    // Show success message
                    alert('Supplier saved successfully!');
                    
                    // Close the panel
                    closeAddSupplierPanel();
                    
                    // In a real app, you would send this data to the server
                    // and update the UI with the new supplier
                    // For demo, we'll reload the page
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                }
                
                // Add event listeners
                if (addSupplierButton) {
                    addSupplierButton.addEventListener('click', openAddSupplierPanel);
                }
                
                if (closeButton) {
                    closeButton.addEventListener('click', closeAddSupplierPanel);
                }
                
                if (cancelButton) {
                    cancelButton.addEventListener('click', closeAddSupplierPanel);
                }
                
                if (overlay) {
                    overlay.addEventListener('click', closeAddSupplierPanel);
                }
                
                if (addProductBtn) {
                    addProductBtn.addEventListener('click', addProductEntry);
                }
                
                if (generateIdBtn) {
                    generateIdBtn.addEventListener('click', generateSupplierId);
                }
                
                if (supplierForm) {
                    supplierForm.addEventListener('submit', saveSupplier);
                }
                
                console.log("Add supplier panel initialized");
            } catch (error) {
                console.error("Error setting up add supplier panel:", error);
            }
        }
        
    } catch (err) {
        console.error("Critical error initializing suppliers page:", err);
        alert("There was an error loading the Suppliers page. Please check the console for details.");
    }
});

// Add event listener for sidebar Supplier link when on other pages
// This ensures we properly navigate to the suppliers page
if (!window.location.pathname.includes('suppliers.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log("Setting up Supplier link handler on non-suppliers page");
            const supplierLink = document.querySelector('.sidebar-menu li a[href="suppliers.html"]');
            
            if (supplierLink) {
                console.log("Supplier link found, adding click handler");
                supplierLink.addEventListener('click', function(e) {
                    console.log("Supplier link clicked, navigating to suppliers.html");
                    // Store this click in sessionStorage so we can detect if we came from a click
                    sessionStorage.setItem('supplierLinkClicked', 'true');
                });
            } else {
                console.error("Supplier link not found in sidebar!");
            }
        } catch (err) {
            console.error("Error setting up Supplier link:", err);
        }
    });
} 