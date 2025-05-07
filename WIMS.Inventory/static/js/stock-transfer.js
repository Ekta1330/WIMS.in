document.addEventListener('DOMContentLoaded', function() {
    // Check if this was a forced navigation from another tab
    const forcedNavigation = sessionStorage.getItem('forcedStockTransferNavigation');
    if (forcedNavigation === 'true') {
        console.log('Detected forced navigation to Stock Transfer page');
        // Clear the flag
        sessionStorage.removeItem('forcedStockTransferNavigation');
        
        // Ensure sidebar link is active
        const sidebarLinks = document.querySelectorAll('.sidebar-menu li a');
        sidebarLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === 'stock-transfer.html') {
                link.parentElement.classList.add('active');
            }
        });
    }
    
    // Clean up any leftover overlay or panel state from other pages
    cleanupPreviousPageState();
    
    // Initialize the stock transfer system
    initStockTransferSystem();
});

function initStockTransferSystem() {
    // Initialize view toggles
    initViewToggles();
    
    // Load sample data
    loadSampleData();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize product selection
    initProductSelection();
    
    // Initialize transfer path visualization
    initTransferPath();
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
    const tableBody = document.querySelector('.transfer-table tbody');
    const cardContainer = document.querySelector('.transfer-cards');
    const loadingSpinners = document.querySelectorAll('.loading-spinner');
    const emptyStates = document.querySelectorAll('.empty-state');
    
    // Sample data
    const transfers = [
        {
            id: "TRF-2023-001",
            date: "2023-11-15",
            fromLocation: "Warehouse A",
            toLocation: "Branch 1",
            products: [
                { name: "4K Smart LED Television", quantity: 5, stockLevel: "medium" },
                { name: "Wireless Bluetooth Headphones", quantity: 10, stockLevel: "high" }
            ],
            reason: "Seasonal stock reallocation",
            handledBy: "Anil Kumar (Admin)"
        },
        {
            id: "TRF-2023-002",
            date: "2023-11-10",
            fromLocation: "Branch 2",
            toLocation: "Warehouse B",
            products: [
                { name: "Men's Formal Cotton Shirt", quantity: 15, stockLevel: "low" }
            ],
            reason: "Return of excess inventory",
            handledBy: "Meera Reddy (User)"
        },
        {
            id: "TRF-2023-003",
            date: "2023-11-05",
            fromLocation: "Warehouse B",
            toLocation: "Branch 1",
            products: [
                { name: "Ergonomic Office Chair", quantity: 3, stockLevel: "medium" },
                { name: "Wooden Coffee Table", quantity: 2, stockLevel: "low" }
            ],
            reason: "Customer order fulfillment",
            handledBy: "Raj Kumar (Admin)"
        },
        {
            id: "TRF-2023-004",
            date: "2023-11-02",
            fromLocation: "Warehouse A",
            toLocation: "Warehouse B",
            products: [
                { name: "Men's Formal Cotton Shirt", quantity: 50, stockLevel: "high" }
            ],
            reason: "Warehouse rebalancing",
            handledBy: "Sunil Gupta (User)"
        }
    ];
    
    // Simulate loading
    setTimeout(() => {
        // Hide loading spinners
        loadingSpinners.forEach(spinner => {
            spinner.style.display = 'none';
        });
        
        if (transfers.length > 0) {
            // Render table rows
            tableBody.innerHTML = generateTableRows(transfers);
            
            // Render cards
            cardContainer.innerHTML = generateCards(transfers);
            
            // Initialize stock status tooltips
            initStockStatusTooltips();
            
            // Initialize action buttons
            initActionButtons();
        } else {
            // Show empty state
            emptyStates.forEach(state => {
                state.style.display = 'flex';
            });
        }
    }, 1000);
}

function generateTableRows(transfers) {
    let html = '';
    
    transfers.forEach(transfer => {
        // Format date
        const formattedDate = formatDate(transfer.date);
        
        // Create product summary
        const productSummary = transfer.products.map(p => p.name).join(', ');
        
        // Calculate total quantity
        const totalQuantity = transfer.products.reduce((sum, product) => sum + product.quantity, 0);
        
        // Generate stock status for each product
        const stockStatusHtml = transfer.products.map(product => {
            return `<div class="stock-status ${product.stockLevel}">
                ${capitalizeFirstLetter(product.stockLevel)}
                <div class="stock-tooltip">
                    ${product.name}: ${getStockLevelDescription(product.stockLevel)}
                </div>
            </div>`;
        }).join('');
        
        html += `
            <tr>
                <td>${transfer.id}</td>
                <td>${formattedDate}</td>
                <td>${transfer.fromLocation}</td>
                <td>${transfer.toLocation}</td>
                <td>${productSummary}</td>
                <td><strong>${totalQuantity}</strong></td>
                <td>${stockStatusHtml}</td>
                <td>${transfer.reason}</td>
                <td><strong>${transfer.handledBy}</strong></td>
                <td class="actions">
                    <button class="action-btn view" data-id="${transfer.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" data-id="${transfer.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" data-id="${transfer.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    
    return html;
}

function generateCards(transfers) {
    let html = '';
    
    transfers.forEach(transfer => {
        // Format date
        const formattedDate = formatDate(transfer.date);
        
        // Generate products HTML
        let productsHtml = '';
        transfer.products.forEach(product => {
            productsHtml += `
                <div class="product-item">
                    <div class="product-name">${product.name}</div>
                    <div class="product-details">
                        Quantity: ${product.quantity}
                        <span class="stock-status ${product.stockLevel}">
                            ${capitalizeFirstLetter(product.stockLevel)}
                            <div class="stock-tooltip">
                                ${getStockLevelDescription(product.stockLevel)}
                            </div>
                        </span>
                    </div>
                </div>
            `;
        });
        
        html += `
            <div class="transfer-card" data-id="${transfer.id}">
                <div class="card-header">
                    <h3>${transfer.id}</h3>
                    <div class="card-date">${formattedDate}</div>
                </div>
                
                <div class="card-body">
                    <div class="card-info">
                        <div class="card-info-row">
                            <div class="info-label">From Location:</div>
                            <div class="info-value">${transfer.fromLocation}</div>
                        </div>
                        <div class="card-info-row">
                            <div class="info-label">To Location:</div>
                            <div class="info-value">${transfer.toLocation}</div>
                        </div>
                        <div class="card-info-row">
                            <div class="info-label">Reason:</div>
                            <div class="info-value">${transfer.reason}</div>
                        </div>
                        <div class="card-info-row">
                            <div class="info-label">Handled By:</div>
                            <div class="info-value"><strong>${transfer.handledBy}</strong></div>
                        </div>
                    </div>
                    
                    <div class="card-products">
                        <h4>Products</h4>
                        ${productsHtml}
                    </div>
                </div>
                
                <div class="card-footer">
                    <button class="action-btn view" data-id="${transfer.id}" title="View"><i class="fas fa-eye"></i> View</button>
                    <button class="action-btn edit" data-id="${transfer.id}" title="Edit"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn delete" data-id="${transfer.id}" title="Delete"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
    });
    
    return html;
}

function initStockStatusTooltips() {
    const stockStatuses = document.querySelectorAll('.stock-status');
    
    stockStatuses.forEach(status => {
        // Add event listeners for mobile devices
        status.addEventListener('touchstart', function() {
            this.querySelector('.stock-tooltip').style.opacity = '1';
            this.querySelector('.stock-tooltip').style.visibility = 'visible';
        });
        
        status.addEventListener('touchend', function() {
            this.querySelector('.stock-tooltip').style.opacity = '0';
            this.querySelector('.stock-tooltip').style.visibility = 'hidden';
        });
    });
}

function initActionButtons() {
    // View buttons
    const viewButtons = document.querySelectorAll('.action-btn.view');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            
            // Find transfer data to determine if it's abnormal
            // This is simplified for demo - in a real app, use actual data
            const isAbnormal = id === 'TRF-2023-002'; // Just for demo purposes
            
            // Find the transfer in our sample data
            const transfer = findTransferById(id);
            if (transfer) {
                // Calculate total quantity
                const totalQuantity = transfer.products.reduce((sum, product) => sum + product.quantity, 0);
                
                // Animate the transfer path before opening the modal
                animateTransferPath(
                    transfer.fromLocation, 
                    transfer.toLocation, 
                    totalQuantity, 
                    isAbnormal
                );
            }
            
            openTransferModal(id);
        });
    });
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.action-btn.edit');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            editTransfer(id);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteTransfer(id);
        });
    });
}

function initEventListeners() {
    // New Transfer button
    const newTransferBtns = document.querySelectorAll('.new-transfer-btn');
    newTransferBtns.forEach(btn => {
        btn.addEventListener('click', openNewTransferPanel);
    });
    
    // Close panel button
    const closePanelBtn = document.querySelector('.close-panel-btn');
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', closeTransferPanel);
    }
    
    // Cancel button in panel
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeTransferPanel);
    }
    
    // Save Transfer button
    const saveTransferBtn = document.querySelector('.save-transfer-btn');
    if (saveTransferBtn) {
        saveTransferBtn.addEventListener('click', saveTransfer);
    }
    
    // Add product button
    const addProductBtn = document.querySelector('.add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', addProduct);
    }
    
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
    
    // Filter functionality
    const filters = document.querySelectorAll('#location-filter');
    filters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    const dateFilters = document.querySelectorAll('#date-from, #date-to');
    dateFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    const searchInput = document.querySelector('#transfer-search');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Remove product button event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-product-btn')) {
            const productItem = e.target.closest('.product-item');
            const productList = document.querySelector('.product-list');
            
            // Don't remove if it's the last product
            if (productList.children.length > 1) {
                productItem.remove();
            }
        }
    });
}

function initProductSelection() {
    // Product inventory data (in a real app, this would come from a database)
    const productInventory = {
        'product-1': { name: '4K Smart LED Television', stock: 25 },
        'product-2': { name: 'Wireless Bluetooth Headphones', stock: 50 },
        'product-3': { name: 'Ergonomic Office Chair', stock: 15 },
        'product-4': { name: 'Wooden Coffee Table', stock: 8 },
        'product-5': { name: 'Men\'s Formal Cotton Shirt', stock: 75 }
    };
    
    // Add event listeners for product selection changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-select')) {
            const productId = e.target.value;
            const productItem = e.target.closest('.product-item');
            const stockCountElement = productItem.querySelector('.stock-count');
            
            if (productId && productInventory[productId]) {
                stockCountElement.textContent = productInventory[productId].stock;
            } else {
                stockCountElement.textContent = '0';
            }
        }
    });
}

function openTransferModal(id) {
    // In a real application, you would fetch the transfer details from the server
    // For this demo, we'll just use a placeholder
    
    const modal = document.querySelector('.transfer-detail-modal');
    const modalBody = modal.querySelector('.modal-body');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Sample transfer details HTML (replace with actual data in a real app)
    modalBody.innerHTML = `
        <div class="transfer-details">
            <div class="detail-section">
                <div class="section-header">Basic Information</div>
                <div class="section-body">
                    <div class="detail-row">
                        <div class="detail-label">Transfer ID:</div>
                        <div class="detail-value">${id}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div class="detail-value">November 15, 2023</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">From Location:</div>
                        <div class="detail-value">Warehouse A</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">To Location:</div>
                        <div class="detail-value">Branch 1</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <div class="section-header">Products</div>
                <div class="section-body">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Stock Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>4K Smart LED Television</td>
                                <td>5</td>
                                <td>
                                    <span class="stock-status medium">
                                        Medium
                                        <div class="stock-tooltip">
                                            Current stock level: 25 units (Medium)
                                        </div>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>Wireless Bluetooth Headphones</td>
                                <td>10</td>
                                <td>
                                    <span class="stock-status high">
                                        High
                                        <div class="stock-tooltip">
                                            Current stock level: 50 units (High)
                                        </div>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="detail-section">
                <div class="section-header">Additional Information</div>
                <div class="section-body">
                    <div class="detail-row">
                        <div class="detail-label">Reason/Remarks:</div>
                        <div class="detail-value">Seasonal stock reallocation</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Handled By:</div>
                        <div class="detail-value">Anil Kumar (Admin)</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal and overlay
    modal.classList.add('open');
    modalOverlay.classList.add('active');
    
    // Initialize stock status tooltips in modal
    initStockStatusTooltips();
    
    // Animate transfer path for this transfer
    // For demo, we'll use hardcoded values - in a real app, use actual data
    animateTransferPath('Warehouse A', 'Branch 1', 15, false);
}

function closeModal() {
    const modal = document.querySelector('.transfer-detail-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    modal.classList.remove('open');
    modalOverlay.classList.remove('active');
}

function editTransfer(id) {
    // In a real application, you would fetch the transfer data and open the form
    // For this demo, we'll just show a message
    alert(`Editing transfer ${id} - This would open the transfer form with data in a real application`);
}

function deleteTransfer(id) {
    // In a real application, you would send a request to delete the transfer
    if (confirm(`Are you sure you want to delete transfer ${id}?`)) {
        alert(`Transfer ${id} deleted successfully!`);
    }
}

function openNewTransferPanel() {
    const panel = document.querySelector('.transfer-panel');
    
    // Generate a new transfer ID
    generateTransferId();
    
    // Set current date
    setCurrentDate();
    
    // Show panel
    panel.classList.add('open');
}

function closeTransferPanel() {
    const panel = document.querySelector('.transfer-panel');
    panel.classList.remove('open');
}

function generateTransferId() {
    const transferIdInput = document.getElementById('transfer-id');
    
    // Generate a new transfer ID
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    transferIdInput.value = `TRF-${year}${month}-${random}`;
}

function setCurrentDate() {
    const dateInput = document.getElementById('transfer-date');
    
    // Set current date
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    dateInput.value = formattedDate;
}

function addProduct() {
    const productList = document.querySelector('.product-list');
    const productCount = productList.children.length + 1;
    
    // Create new product item
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    
    // Set product item content
    productItem.innerHTML = `
        <div class="product-select-container">
            <select class="product-select" required>
                <option value="">Select product</option>
                <option value="product-1">4K Smart LED Television</option>
                <option value="product-2">Wireless Bluetooth Headphones</option>
                <option value="product-3">Ergonomic Office Chair</option>
                <option value="product-4">Wooden Coffee Table</option>
                <option value="product-5">Men's Formal Cotton Shirt</option>
            </select>
            <div class="stock-info">
                <span class="available-stock">Available: <span class="stock-count">0</span></span>
            </div>
        </div>
        <div class="quantity-container">
            <label for="quantity-${productCount}">Quantity:</label>
            <input type="number" id="quantity-${productCount}" class="quantity-input" min="1" required>
        </div>
        <button type="button" class="remove-product-btn"><i class="fas fa-trash"></i></button>
    `;
    
    // Add to product list
    productList.appendChild(productItem);
}

function saveTransfer() {
    // Get form data
    const transferId = document.getElementById('transfer-id').value;
    const transferDate = document.getElementById('transfer-date').value;
    const fromLocation = document.getElementById('from-location').value;
    const toLocation = document.getElementById('to-location').value;
    const remarks = document.getElementById('remarks').value;
    const handledBy = document.getElementById('handled-by').value;
    
    // Validate form
    if (!transferId || !transferDate || !fromLocation || !toLocation || !handledBy) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate products
    const productSelects = document.querySelectorAll('.product-select');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const products = [];
    
    for (let i = 0; i < productSelects.length; i++) {
        const productId = productSelects[i].value;
        const quantity = quantityInputs[i].value;
        
        if (!productId || !quantity) {
            alert('Please select a product and enter a quantity for all product rows');
            return;
        }
        
        // In a real app, you would validate that the quantity is not more than available stock
        
        // Get product name from the selected option
        const productName = productSelects[i].options[productSelects[i].selectedIndex].text;
        
        products.push({
            id: productId,
            name: productName,
            quantity: parseInt(quantity)
        });
    }
    
    // In a real application, you would send this data to the server
    console.log({
        id: transferId,
        date: transferDate,
        fromLocation,
        toLocation,
        products,
        remarks,
        handledBy
    });
    
    // Calculate total quantity
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
    
    // Get from and to location display names
    const fromLocationName = document.getElementById('from-location').options[document.getElementById('from-location').selectedIndex].text;
    const toLocationName = document.getElementById('to-location').options[document.getElementById('to-location').selectedIndex].text;
    
    // Check if this is an abnormal transfer (for demo purposes, we'll consider transfers > 30 items as abnormal)
    const isAbnormal = totalQuantity > 30;
    
    // Animate the transfer path
    animateTransferPath(fromLocationName, toLocationName, totalQuantity, isAbnormal);
    
    // Show success message
    showToast();
    
    // Close panel
    closeTransferPanel();
    
    // Reload data (in a real app, you would fetch updated data from the server)
    loadSampleData();
}

function showToast() {
    const toast = document.querySelector('.toast.transfer-success');
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function applyFilters() {
    // In a real application, you would filter the data and update the display
    // For this demo, we'll just show a message
    console.log('Filters applied');
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStockLevelDescription(level) {
    switch (level) {
        case 'low':
            return 'Stock is running low (less than 10 units)';
        case 'medium':
            return 'Stock is at moderate levels (10-30 units)';
        case 'high':
            return 'Stock is well stocked (more than 30 units)';
        default:
            return 'Stock information not available';
    }
}

function initTransferPath() {
    // Default state - hidden
    const transferPath = document.querySelector('.transfer-path');
    const transferInfo = document.querySelector('.transfer-info');
    const transferStatus = document.querySelector('.transfer-status');
    
    // Initially hide the transfer path visualization
    if (transferPath) {
        transferPath.classList.remove('active');
        transferInfo.classList.remove('show');
        transferStatus.classList.remove('show');
    }
}

function animateTransferPath(sourceLocation, destinationLocation, quantity, isAbnormal = false) {
    const transferPath = document.querySelector('.transfer-path');
    const transferInfo = document.querySelector('.transfer-info');
    const transferStatus = document.querySelector('.transfer-status');
    const sourceLabel = document.querySelector('.location-label.source');
    const destLabel = document.querySelector('.location-label.destination');
    const quantityElement = document.querySelector('.transfer-info .quantity');
    const sourceMarker = document.querySelector('.location-marker.source');
    const destMarker = document.querySelector('.location-marker.destination');
    
    // Reset classes
    transferPath.classList.remove('active', 'abnormal');
    transferInfo.classList.remove('show', 'abnormal');
    transferStatus.classList.remove('show', 'abnormal');
    sourceMarker.classList.remove('abnormal');
    destMarker.classList.remove('abnormal');
    
    // Update location labels
    sourceLabel.textContent = sourceLocation;
    destLabel.textContent = destinationLocation;
    
    // Update quantity
    quantityElement.textContent = quantity;
    
    // Add abnormal class if needed
    if (isAbnormal) {
        transferPath.classList.add('abnormal');
        transferInfo.classList.add('abnormal');
        transferStatus.classList.add('abnormal');
        sourceMarker.classList.add('abnormal');
        destMarker.classList.add('abnormal');
        transferStatus.textContent = 'Abnormal Transfer Detected';
    } else {
        transferStatus.textContent = 'Transfer Complete';
    }
    
    // Start animation sequence
    setTimeout(() => {
        transferPath.classList.add('active');
        
        setTimeout(() => {
            transferInfo.classList.add('show');
            
            setTimeout(() => {
                transferStatus.classList.add('show');
            }, 500);
        }, 750);
    }, 100);
}

// Helper function to find transfer by ID
function findTransferById(id) {
    // This is a simplified version - in a real app, you'd fetch from a database
    const transfers = [
        {
            id: "TRF-2023-001",
            date: "2023-11-15",
            fromLocation: "Warehouse A",
            toLocation: "Branch 1",
            products: [
                { name: "4K Smart LED Television", quantity: 5, stockLevel: "medium" },
                { name: "Wireless Bluetooth Headphones", quantity: 10, stockLevel: "high" }
            ],
            reason: "Seasonal stock reallocation",
            handledBy: "Anil Kumar (Admin)"
        },
        {
            id: "TRF-2023-002",
            date: "2023-11-10",
            fromLocation: "Branch 2",
            toLocation: "Warehouse B",
            products: [
                { name: "Men's Formal Cotton Shirt", quantity: 15, stockLevel: "low" }
            ],
            reason: "Return of excess inventory",
            handledBy: "Meera Reddy (User)"
        },
        {
            id: "TRF-2023-003",
            date: "2023-11-05",
            fromLocation: "Warehouse B",
            toLocation: "Branch 1",
            products: [
                { name: "Ergonomic Office Chair", quantity: 3, stockLevel: "medium" },
                { name: "Wooden Coffee Table", quantity: 2, stockLevel: "low" }
            ],
            reason: "Customer order fulfillment",
            handledBy: "Raj Kumar (Admin)"
        },
        {
            id: "TRF-2023-004",
            date: "2023-11-02",
            fromLocation: "Warehouse A",
            toLocation: "Warehouse B",
            products: [
                { name: "Men's Formal Cotton Shirt", quantity: 50, stockLevel: "high" }
            ],
            reason: "Warehouse rebalancing",
            handledBy: "Sunil Gupta (User)"
        }
    ];
    
    return transfers.find(transfer => transfer.id === id);
}

// Function to clean up any leftover state from previous pages
function cleanupPreviousPageState() {
    // Check for any active overlays from other pages and remove them
    const overlays = document.querySelectorAll('.panel-overlay, .modal-overlay');
    overlays.forEach(overlay => {
        overlay.classList.remove('active');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
        
        // Remove styles after transition
        setTimeout(() => {
            overlay.removeAttribute('style');
        }, 300);
    });
    
    // Ensure body scroll is enabled
    document.body.style.overflow = '';
    
    // Check for any open panels and close them
    const panels = document.querySelectorAll('.new-purchase-panel, .panel');
    panels.forEach(panel => {
        if (panel.classList.contains('open') || panel.classList.contains('active')) {
            panel.classList.remove('open', 'active');
            
            // For slide-in panels, move them off-screen
            if (panel.classList.contains('new-purchase-panel')) {
                panel.style.right = '-800px';
            } else {
                panel.style.transform = 'translateX(100%)';
            }
            
            // Remove styles after transition
            setTimeout(() => {
                panel.removeAttribute('style');
            }, 300);
        }
    });
    
    console.log('Cleaned up previous page state');
} 