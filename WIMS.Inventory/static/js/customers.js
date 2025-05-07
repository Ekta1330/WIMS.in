// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Customers page loaded - initializing");
    
    try {
        // Initialize elements
        const customerTypeFilter = document.getElementById('customer-type-filter');
        const statusFilter = document.getElementById('status-filter');
        const balanceFilter = document.getElementById('balance-filter');
        const customerSearch = document.getElementById('customer-search');
        const customerTable = document.querySelector('.customer-table');
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const viewContainers = document.querySelectorAll('.view-container');
        const addCustomerBtn = document.querySelector('.add-customer-btn');
        
        // Log whether elements were found
        console.log("Elements found:", {
            customerTypeFilter: !!customerTypeFilter,
            statusFilter: !!statusFilter,
            balanceFilter: !!balanceFilter,
            customerSearch: !!customerSearch,
            customerTable: !!customerTable,
            toggleBtns: toggleBtns.length,
            viewContainers: viewContainers.length,
            addCustomerBtn: !!addCustomerBtn
        });
        
        if (!customerTable) {
            console.error("Customer table not found in the DOM!");
            return;
        }
        
        const tableRows = customerTable.querySelectorAll('tbody tr');
        console.log(`Found ${tableRows.length} customer rows`);
        
        // Make sure sidebar Customers link is active
        activateSidebarLink();
        
        // Setup view toggle (table/card view)
        setupViewToggle();
        
        // Setup address toggle buttons
        setupAddressToggles();
        
        // Setup search and filter functionality
        setupSearchAndFilters();
        
        // Setup action buttons
        setupActionButtons();
        
        // Setup Add Customer Panel
        setupAddCustomerPanel();
        
        // Make sure sidebar Customers link is marked as active
        function activateSidebarLink() {
            try {
                // Find the Customers link in the sidebar and ensure it's active
                const sidebarItems = document.querySelectorAll('.sidebar-menu li');
                sidebarItems.forEach(item => {
                    // Remove active from all
                    item.classList.remove('active');
                    
                    // Check if this is the Customers link
                    const link = item.querySelector('a');
                    if (link && link.getAttribute('href') === 'customers.html') {
                        item.classList.add('active');
                        console.log("Customers sidebar link activated");
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
        
        // Setup address toggle buttons to show/hide full address
        function setupAddressToggles() {
            try {
                // For table view
                const addressToggleBtns = document.querySelectorAll('.address-toggle');
                addressToggleBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const addressDetails = this.nextElementSibling;
                        addressDetails.classList.toggle('show');
                        this.textContent = addressDetails.classList.contains('show') ? 'Hide Address' : 'View Address';
                    });
                });
                
                // For card view
                const addressPreviews = document.querySelectorAll('.address-preview');
                addressPreviews.forEach(preview => {
                    preview.addEventListener('click', function() {
                        const fullAddress = this.nextElementSibling;
                        fullAddress.classList.toggle('show');
                    });
                });
                
                console.log("Address toggles initialized");
            } catch (error) {
                console.error("Error setting up address toggles:", error);
            }
        }
        
        // Setup search and filter functionality
        function setupSearchAndFilters() {
            try {
                const filterFunction = () => {
                    const searchTerm = customerSearch.value.toLowerCase();
                    const selectedType = customerTypeFilter.value;
                    const selectedStatus = statusFilter.value;
                    const selectedBalance = balanceFilter.value;
                    
                    let matchCount = 0;
                    tableRows.forEach(row => {
                        const customerId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                        const customerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                        const customerEmail = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                        const customerType = row.querySelector('td:nth-child(6)').textContent;
                        
                        // Determine balance status from the class
                        const balanceStatusElement = row.querySelector('.balance-status');
                        const balanceStatus = balanceStatusElement ? 
                            Array.from(balanceStatusElement.classList)
                                .find(cls => ['clear', 'pending', 'overdue'].includes(cls)) || ''
                            : '';
                        
                        // Check if the row matches all filters
                        const matchesSearch = customerId.includes(searchTerm) || 
                                            customerName.includes(searchTerm) || 
                                            customerEmail.includes(searchTerm);
                        
                        const matchesType = selectedType === '' || customerType === selectedType;
                        const matchesStatus = selectedStatus === '' || true; // Not implemented in sample data
                        const matchesBalance = selectedBalance === '' || balanceStatus === selectedBalance;
                        
                        // Show or hide row based on filters
                        if (matchesSearch && matchesType && matchesStatus && matchesBalance) {
                            row.style.display = '';
                            matchCount++;
                        } else {
                            row.style.display = 'none';
                        }
                    });
                    
                    console.log(`Filter applied: ${matchCount} customers match the criteria`);
                    
                    // Also filter card view if it exists
                    const customerCards = document.querySelectorAll('.customer-card');
                    if (customerCards.length > 0) {
                        filterCardView(searchTerm, selectedType, selectedStatus, selectedBalance);
                    }
                };
                
                // Add event listeners to inputs
                if (customerSearch) {
                    customerSearch.addEventListener('input', filterFunction);
                }
                
                if (customerTypeFilter) {
                    customerTypeFilter.addEventListener('change', filterFunction);
                }
                
                if (statusFilter) {
                    statusFilter.addEventListener('change', filterFunction);
                }
                
                if (balanceFilter) {
                    balanceFilter.addEventListener('change', filterFunction);
                }
                
                console.log("Search and filters initialized");
            } catch (error) {
                console.error("Error setting up search and filters:", error);
            }
        }
        
        // Filter card view based on search and filter criteria
        function filterCardView(searchTerm, selectedType, selectedStatus, selectedBalance) {
            try {
                const customerCards = document.querySelectorAll('.customer-card');
                customerCards.forEach(card => {
                    const customerName = card.querySelector('.customer-name h3').textContent.toLowerCase();
                    const customerId = card.querySelector('.customer-id').textContent.toLowerCase();
                    const customerType = card.querySelector('.customer-type').textContent;
                    const balanceStatusElement = card.querySelector('.balance-status');
                    const balanceStatus = balanceStatusElement ? 
                        Array.from(balanceStatusElement.classList)
                            .find(cls => ['clear', 'pending', 'overdue'].includes(cls)) || ''
                        : '';
                    
                    // Check if card matches all filters
                    const matchesSearch = customerId.includes(searchTerm) || 
                                        customerName.includes(searchTerm);
                    
                    const matchesType = selectedType === '' || customerType === selectedType;
                    const matchesStatus = selectedStatus === '' || true; // Not implemented in sample data
                    const matchesBalance = selectedBalance === '' || balanceStatus === selectedBalance;
                    
                    // Show or hide card based on filters
                    if (matchesSearch && matchesType && matchesStatus && matchesBalance) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            } catch (error) {
                console.error("Error filtering card view:", error);
            }
        }
        
        // Setup action buttons (view, edit)
        function setupActionButtons() {
            try {
                // View buttons
                const viewButtons = document.querySelectorAll('.action-btn.view, .card-btn.view');
                viewButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const row = this.closest('tr') || this.closest('.customer-card');
                        const customerId = row.querySelector('.customer-id') ? 
                            row.querySelector('.customer-id').textContent : 
                            row.querySelector('td:first-child').textContent;
                        
                        alert(`Viewing details for customer ${customerId}`);
                        // In a real app, this would open a detailed view or a modal
                    });
                });
                
                // Edit buttons
                const editButtons = document.querySelectorAll('.action-btn.edit, .card-btn.edit');
                editButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const row = this.closest('tr') || this.closest('.customer-card');
                        const customerId = row.querySelector('.customer-id') ? 
                            row.querySelector('.customer-id').textContent : 
                            row.querySelector('td:first-child').textContent;
                        
                        alert(`Editing customer ${customerId}`);
                        // In a real app, this would open an edit form or a modal
                    });
                });
                
                // Add Customer button
                if (addCustomerBtn) {
                    addCustomerBtn.addEventListener('click', function() {
                        openAddCustomerPanel();
                    });
                }
                
                console.log("Action buttons initialized");
            } catch (error) {
                console.error("Error setting up action buttons:", error);
            }
        }
        
        // Setup Add Customer Panel
        function setupAddCustomerPanel() {
            try {
                const addCustomerBtn = document.querySelector('.add-customer-btn');
                const addCustomerPanel = document.querySelector('.add-customer-panel');
                const panelOverlay = document.querySelector('.panel-overlay');
                const closePanelBtn = document.querySelector('.close-panel-btn');
                const cancelBtn = document.querySelector('.cancel-btn');
                const customerForm = document.getElementById('add-customer-form');
                const generateIdBtn = document.querySelector('.generate-id-btn');
                const sameAsBillingCheckbox = document.getElementById('same-as-billing');
                const shippingAddressRow = document.querySelector('.shipping-address-row');
                const customerTypeSelect = document.getElementById('customer-type');
                const b2bSection = document.querySelector('.b2b-section');
                
                // Open panel when clicking Add New Customer button
                if (addCustomerBtn) {
                    addCustomerBtn.addEventListener('click', function() {
                        openAddCustomerPanel();
                    });
                }
                
                // Close panel when clicking the close button
                if (closePanelBtn) {
                    closePanelBtn.addEventListener('click', closeAddCustomerPanel);
                }
                
                // Close panel when clicking the cancel button
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', closeAddCustomerPanel);
                }
                
                // Close panel when clicking outside the panel
                if (panelOverlay) {
                    panelOverlay.addEventListener('click', closeAddCustomerPanel);
                }
                
                // Generate random customer ID
                if (generateIdBtn) {
                    generateIdBtn.addEventListener('click', function() {
                        const customerId = document.getElementById('customer-id');
                        const randomNum = Math.floor(1000 + Math.random() * 9000);
                        customerId.value = `CUST-${randomNum}`;
                        updatePreview('id', customerId.value);
                    });
                }
                
                // Toggle shipping address based on checkbox
                if (sameAsBillingCheckbox) {
                    sameAsBillingCheckbox.addEventListener('change', function() {
                        if (this.checked) {
                            shippingAddressRow.style.display = 'none';
                        } else {
                            shippingAddressRow.style.display = '';
                        }
                    });
                }
                
                // Toggle B2B section based on customer type
                if (customerTypeSelect) {
                    customerTypeSelect.addEventListener('change', function() {
                        if (this.value === 'B2B') {
                            b2bSection.style.display = 'block';
                        } else {
                            b2bSection.style.display = 'none';
                        }
                        updatePreview('type', this.value);
                    });
                }
                
                // Set up live preview updates
                setupLivePreview();
                
                // Handle form submission
                if (customerForm) {
                    customerForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        saveCustomer();
                    });
                }
                
                console.log("Add Customer panel setup complete");
            } catch (error) {
                console.error("Error setting up Add Customer panel:", error);
            }
        }
        
        // Open Add Customer Panel
        function openAddCustomerPanel() {
            try {
                const addCustomerPanel = document.querySelector('.add-customer-panel');
                const panelOverlay = document.querySelector('.panel-overlay');
                
                if (addCustomerPanel && panelOverlay) {
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                    panelOverlay.classList.add('active');
                    addCustomerPanel.classList.add('active');
                }
            } catch (error) {
                console.error("Error opening Add Customer panel:", error);
            }
        }
        
        // Close Add Customer Panel
        function closeAddCustomerPanel() {
            try {
                const addCustomerPanel = document.querySelector('.add-customer-panel');
                const panelOverlay = document.querySelector('.panel-overlay');
                
                if (addCustomerPanel && panelOverlay) {
                    document.body.style.overflow = '';
                    panelOverlay.classList.remove('active');
                    addCustomerPanel.classList.remove('active');
                    
                    // Reset the form when closing
                    const customerForm = document.getElementById('add-customer-form');
                    if (customerForm) {
                        customerForm.reset();
                        resetPreview();
                    }
                }
            } catch (error) {
                console.error("Error closing Add Customer panel:", error);
            }
        }
        
        // Set up live preview of customer data as it's entered
        function setupLivePreview() {
            try {
                // Get all input fields and their corresponding preview elements
                const nameInput = document.getElementById('customer-name');
                const idInput = document.getElementById('customer-id');
                const typeSelect = document.getElementById('customer-type');
                const contactInput = document.getElementById('customer-contact');
                const emailInput = document.getElementById('customer-email');
                const billingAddressInput = document.getElementById('billing-address');
                const gstinInput = document.getElementById('gstin');
                const creditLimitInput = document.getElementById('credit-limit');
                const outstandingBalanceInput = document.getElementById('outstanding-balance');
                
                // Add input event listeners to update preview in real-time
                if (nameInput) {
                    nameInput.addEventListener('input', function() {
                        updatePreview('name', this.value);
                    });
                }
                
                if (idInput) {
                    idInput.addEventListener('input', function() {
                        updatePreview('id', this.value);
                    });
                }
                
                if (typeSelect) {
                    typeSelect.addEventListener('change', function() {
                        updatePreview('type', this.value);
                    });
                }
                
                if (contactInput) {
                    contactInput.addEventListener('input', function() {
                        updatePreview('contact', this.value);
                    });
                }
                
                if (emailInput) {
                    emailInput.addEventListener('input', function() {
                        updatePreview('email', this.value);
                    });
                }
                
                if (billingAddressInput) {
                    billingAddressInput.addEventListener('input', function() {
                        updatePreview('address', this.value);
                    });
                }
                
                if (gstinInput) {
                    gstinInput.addEventListener('input', function() {
                        updatePreview('gstin', this.value);
                    });
                }
                
                if (creditLimitInput) {
                    creditLimitInput.addEventListener('input', function() {
                        updatePreview('creditLimit', this.value);
                    });
                }
                
                if (outstandingBalanceInput) {
                    outstandingBalanceInput.addEventListener('input', function() {
                        updatePreview('outstanding', this.value);
                    });
                }
            } catch (error) {
                console.error("Error setting up live preview:", error);
            }
        }
        
        // Update customer preview card
        function updatePreview(field, value) {
            try {
                switch (field) {
                    case 'name':
                        const namePreview = document.querySelector('.customer-name-preview h4');
                        if (namePreview) {
                            namePreview.textContent = value || 'New Customer';
                        }
                        break;
                        
                    case 'id':
                        const idPreview = document.querySelector('.customer-id-preview');
                        if (idPreview) {
                            idPreview.textContent = value || 'CUST-AUTO';
                        }
                        break;
                        
                    case 'type':
                        const typePreview = document.querySelector('.customer-type-preview');
                        const gstinRow = document.querySelector('.gstin-preview-row');
                        if (typePreview) {
                            typePreview.textContent = value || 'B2C';
                        }
                        if (gstinRow) {
                            gstinRow.style.display = value === 'B2B' ? 'block' : 'none';
                        }
                        break;
                        
                    case 'contact':
                        const contactPreview = document.querySelector('.contact-preview');
                        if (contactPreview) {
                            contactPreview.textContent = value || 'Not provided';
                        }
                        break;
                        
                    case 'email':
                        const emailPreview = document.querySelector('.email-preview');
                        if (emailPreview) {
                            emailPreview.textContent = value || 'Not provided';
                        }
                        break;
                        
                    case 'address':
                        const addressPreview = document.querySelector('.address-preview');
                        if (addressPreview) {
                            addressPreview.textContent = value ? (value.length > 30 ? value.substring(0, 30) + '...' : value) : 'Not provided';
                        }
                        break;
                        
                    case 'gstin':
                        const gstinPreview = document.querySelector('.gstin-preview');
                        if (gstinPreview) {
                            gstinPreview.textContent = value || 'Not provided';
                        }
                        break;
                        
                    case 'creditLimit':
                        const creditLimitPreview = document.querySelector('.credit-limit-preview');
                        if (creditLimitPreview) {
                            creditLimitPreview.textContent = value ? `₹${formatNumber(value)}` : '₹0';
                        }
                        break;
                        
                    case 'outstanding':
                        const outstandingPreview = document.querySelector('.outstanding-preview');
                        if (outstandingPreview) {
                            outstandingPreview.textContent = value ? `₹${formatNumber(value)}` : '₹0';
                        }
                        break;
                }
            } catch (error) {
                console.error("Error updating preview:", error);
            }
        }
        
        // Reset preview to default values
        function resetPreview() {
            try {
                document.querySelector('.customer-name-preview h4').textContent = 'New Customer';
                document.querySelector('.customer-id-preview').textContent = 'CUST-AUTO';
                document.querySelector('.customer-type-preview').textContent = 'B2C';
                document.querySelector('.contact-preview').textContent = 'Not provided';
                document.querySelector('.email-preview').textContent = 'Not provided';
                document.querySelector('.address-preview').textContent = 'Not provided';
                document.querySelector('.gstin-preview').textContent = 'Not provided';
                document.querySelector('.credit-limit-preview').textContent = '₹0';
                document.querySelector('.outstanding-preview').textContent = '₹0';
                
                // Reset form fields visibility
                document.querySelector('.shipping-address-row').style.display = '';
                document.querySelector('.b2b-section').style.display = 'none';
                document.querySelector('.gstin-preview-row').style.display = 'none';
            } catch (error) {
                console.error("Error resetting preview:", error);
            }
        }
        
        // Save customer
        function saveCustomer() {
            try {
                // Get form values
                const customerId = document.getElementById('customer-id').value || generateCustomerId();
                const customerName = document.getElementById('customer-name').value;
                const customerType = document.getElementById('customer-type').value;
                const contact = document.getElementById('customer-contact').value;
                const email = document.getElementById('customer-email').value;
                const billingAddress = document.getElementById('billing-address').value;
                const sameAsBilling = document.getElementById('same-as-billing').checked;
                const shippingAddress = sameAsBilling ? billingAddress : document.getElementById('shipping-address').value;
                const gstin = document.getElementById('gstin').value;
                const creditLimit = document.getElementById('credit-limit').value;
                const outstandingBalance = document.getElementById('outstanding-balance').value;
                
                // Validate required fields
                if (!customerName) {
                    alert('Please enter a customer name');
                    return;
                }
                
                // For demonstration, add customer to the table view
                addCustomerToTable({
                    id: customerId,
                    name: customerName,
                    type: customerType,
                    contact: contact,
                    email: email,
                    billingAddress: billingAddress,
                    shippingAddress: shippingAddress,
                    gstin: customerType === 'B2B' ? gstin : '-',
                    creditLimit: creditLimit || '0',
                    outstandingBalance: outstandingBalance || '0'
                });
                
                // Also add to card view if it exists
                const cardView = document.querySelector('.card-view');
                if (cardView) {
                    addCustomerToCardView({
                        id: customerId,
                        name: customerName,
                        type: customerType,
                        contact: contact,
                        email: email,
                        billingAddress: billingAddress,
                        shippingAddress: shippingAddress,
                        gstin: customerType === 'B2B' ? gstin : '-',
                        creditLimit: creditLimit || '0',
                        outstandingBalance: outstandingBalance || '0'
                    });
                }
                
                // Close the panel
                closeAddCustomerPanel();
                
                // Show success message
                alert('Customer added successfully!');
            } catch (error) {
                console.error("Error saving customer:", error);
                alert('There was an error saving the customer. Please try again.');
            }
        }
        
        // Generate a random customer ID
        function generateCustomerId() {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            return `CUST-${randomNum}`;
        }
        
        // Add customer to table view
        function addCustomerToTable(customer) {
            try {
                const table = document.querySelector('.customer-table tbody');
                if (!table) return;
                
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.contact || '-'}</td>
                    <td>${customer.email || '-'}</td>
                    <td>
                        <button class="address-toggle">View Address</button>
                        <div class="address-details">
                            <p><strong>Billing:</strong> ${customer.billingAddress || '-'}</p>
                            <p><strong>Shipping:</strong> ${customer.shippingAddress || 'Same as billing'}</p>
                        </div>
                    </td>
                    <td>${customer.type}</td>
                    <td>${customer.gstin}</td>
                    <td>₹${formatNumber(customer.creditLimit)}</td>
                    <td><span class="balance-status ${getBalanceStatusClass(customer.outstandingBalance)}">₹${formatNumber(customer.outstandingBalance)}</span></td>
                    <td class="actions">
                        <button class="action-btn view"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                    </td>
                `;
                
                // Add event listeners
                const addressToggle = newRow.querySelector('.address-toggle');
                if (addressToggle) {
                    addressToggle.addEventListener('click', function() {
                        const addressDetails = this.nextElementSibling;
                        addressDetails.classList.toggle('show');
                        this.textContent = addressDetails.classList.contains('show') ? 'Hide Address' : 'View Address';
                    });
                }
                
                const viewButton = newRow.querySelector('.action-btn.view');
                if (viewButton) {
                    viewButton.addEventListener('click', function() {
                        alert(`Viewing details for customer ${customer.id}`);
                    });
                }
                
                const editButton = newRow.querySelector('.action-btn.edit');
                if (editButton) {
                    editButton.addEventListener('click', function() {
                        alert(`Editing customer ${customer.id}`);
                    });
                }
                
                // Add the row to the table
                table.appendChild(newRow);
            } catch (error) {
                console.error("Error adding customer to table:", error);
            }
        }
        
        // Add customer to card view
        function addCustomerToCardView(customer) {
            try {
                const cardsContainer = document.querySelector('.customer-cards');
                if (!cardsContainer) return;
                
                const card = document.createElement('div');
                card.className = 'customer-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="customer-name">
                            <h3>${customer.name}</h3>
                            <span class="customer-id">${customer.id}</span>
                        </div>
                        <div class="customer-type">${customer.type}</div>
                    </div>
                    <div class="card-body">
                        <div class="info-group">
                            <div class="info-item">
                                <span class="info-label"><i class="fas fa-phone"></i> Contact:</span>
                                <span class="info-value">${customer.contact || '-'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label"><i class="fas fa-envelope"></i> Email:</span>
                                <span class="info-value">${customer.email || '-'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label"><i class="fas fa-map-marker-alt"></i> Address:</span>
                                <span class="info-value address-preview">${truncateText(customer.billingAddress, 30) || '-'}</span>
                                <div class="full-address">
                                    <p><strong>Billing:</strong> ${customer.billingAddress || '-'}</p>
                                    <p><strong>Shipping:</strong> ${customer.shippingAddress || 'Same as billing'}</p>
                                </div>
                            </div>
                            ${customer.type === 'B2B' ? `
                            <div class="info-item">
                                <span class="info-label"><i class="fas fa-id-card"></i> GSTIN:</span>
                                <span class="info-value">${customer.gstin}</span>
                            </div>
                            ` : ''}
                        </div>
                        <div class="financial-info">
                            <div class="financial-item">
                                <span class="fin-label">Credit Limit</span>
                                <span class="fin-value">₹${formatNumber(customer.creditLimit)}</span>
                            </div>
                            <div class="financial-item">
                                <span class="fin-label">Outstanding</span>
                                <span class="fin-value balance-status ${getBalanceStatusClass(customer.outstandingBalance)}">₹${formatNumber(customer.outstandingBalance)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="card-btn view"><i class="fas fa-eye"></i> View</button>
                        <button class="card-btn edit"><i class="fas fa-edit"></i> Edit</button>
                    </div>
                `;
                
                // Add event listeners
                const addressPreview = card.querySelector('.address-preview');
                if (addressPreview) {
                    addressPreview.addEventListener('click', function() {
                        const fullAddress = this.nextElementSibling;
                        fullAddress.classList.toggle('show');
                    });
                }
                
                const viewButton = card.querySelector('.card-btn.view');
                if (viewButton) {
                    viewButton.addEventListener('click', function() {
                        alert(`Viewing details for customer ${customer.id}`);
                    });
                }
                
                const editButton = card.querySelector('.card-btn.edit');
                if (editButton) {
                    editButton.addEventListener('click', function() {
                        alert(`Editing customer ${customer.id}`);
                    });
                }
                
                // Add the card to the container
                cardsContainer.appendChild(card);
            } catch (error) {
                console.error("Error adding customer to card view:", error);
            }
        }
        
        // Helper function to truncate text
        function truncateText(text, maxLength) {
            if (!text) return '';
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }
        
        // Helper function to format numbers
        function formatNumber(num) {
            if (!num) return '0';
            return new Intl.NumberFormat('en-IN').format(parseInt(num));
        }
        
        // Helper function to determine balance status class
        function getBalanceStatusClass(balance) {
            const numBalance = parseInt(balance) || 0;
            if (numBalance === 0) return 'clear';
            if (numBalance > 50000) return 'overdue';
            return 'pending';
        }
        
        // Log successful initialization
        console.log("Customers page initialization complete");
        
    } catch (err) {
        console.error("Critical error initializing customers page:", err);
        alert("There was an error loading the Customers page. Please check the console for details.");
    }
});

// Add event listener for sidebar Customers link when on other pages
// This ensures we properly navigate to the customers page
if (!window.location.pathname.includes('customers.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log("Setting up Customers link handler on non-customers page");
            const customersLink = document.querySelector('.sidebar-menu li a[href="customers.html"]');
            
            if (customersLink) {
                console.log("Customers link found, adding click handler");
                customersLink.addEventListener('click', function(e) {
                    console.log("Customers link clicked, navigating to customers.html");
                    sessionStorage.setItem('customersLinkClicked', 'true');
                });
            } else {
                console.error("Customers link not found in sidebar!");
            }
        } catch (err) {
            console.error("Error setting up Customers link:", err);
        }
    });
} 