// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Products page loaded - initializing");
    
    try {
        // Verify DOM elements exist before accessing them
        const categoryFilter = document.getElementById('category-filter');
        const productSearch = document.getElementById('product-search');
        const productsTable = document.querySelector('.products-table');
        const addProductBtn = document.querySelector('.add-product-btn');
        
        // Log whether elements were found
        console.log("Elements found:", {
            categoryFilter: !!categoryFilter,
            productSearch: !!productSearch, 
            productsTable: !!productsTable,
            addProductBtn: !!addProductBtn
        });
        
        // Only proceed if necessary elements exist
        if (!productsTable) {
            console.error("Products table not found in the DOM!");
            return;
        }
        
        const tableRows = productsTable.querySelectorAll('tbody tr');
        console.log(`Found ${tableRows.length} product rows`);
        
        // Add New Product Panel Elements
        const addProductPanel = document.querySelector('.add-product-panel');
        const panelOverlay = document.querySelector('.panel-overlay');
        const closePanelBtn = document.querySelector('.close-panel-btn');
        const cancelBtn = document.querySelector('.cancel-btn');
        const saveProductBtn = document.querySelector('.save-btn');
        const productImageInput = document.getElementById('product-image-input');
        const imagePreview = document.getElementById('image-preview');
        const productForm = document.getElementById('add-product-form');
        
        // Set stock level indicators
        setStockLevelIndicators();
        
        // Search functionality
        if (productSearch) {
            productSearch.addEventListener('input', filterProducts);
            console.log("Search listener attached");
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterProducts);
            console.log("Category filter listener attached");
        }
        
        // Button interactions
        setupButtonInteractions();
        
        // Setup Add Product Panel
        setupAddProductPanel();
        
        // Ensure sidebar Products link is active
        activateSidebarLink();
        
        // Set up sortable table headers
        setupTableSorting();
        
        // Mark initialization as successful
        window.wimsProductsInit = true;
        console.log("Products page initialization complete");
        
        // Highlight stock levels based on reorder points
        function setStockLevelIndicators() {
            try {
                tableRows.forEach(row => {
                    const stockCell = row.querySelector('td:nth-child(9)');
                    const stockSpan = stockCell.querySelector('.stock-level');
                    const stockValue = parseInt(stockSpan.textContent);
                    const reorderLevel = parseInt(row.querySelector('td:nth-child(10)').textContent);
                    
                    // Clear any existing classes
                    stockSpan.classList.remove('sufficient', 'warning', 'critical');
                    
                    // Set appropriate class based on stock level
                    if (stockValue <= reorderLevel * 0.5) {
                        stockSpan.classList.add('critical');
                    } else if (stockValue <= reorderLevel) {
                        stockSpan.classList.add('warning');
                    } else {
                        stockSpan.classList.add('sufficient');
                    }
                });
                console.log("Stock level indicators set successfully");
            } catch (error) {
                console.error("Error setting stock level indicators:", error);
            }
        }
        
        // Make sure sidebar Products link is marked as active
        function activateSidebarLink() {
            try {
                // Find the Products link in the sidebar and activate it
                const sidebarItems = document.querySelectorAll('.sidebar-menu li');
                sidebarItems.forEach(item => {
                    // Remove active from all
                    item.classList.remove('active');
                    
                    // Check if this is the Products link
                    const link = item.querySelector('a');
                    if (link && link.textContent.trim().includes('Products')) {
                        item.classList.add('active');
                        console.log("Products sidebar link activated");
                    }
                });
            } catch (error) {
                console.error("Error activating sidebar link:", error);
            }
        }
        
        // Filter products based on search and category
        function filterProducts() {
            try {
                const searchTerm = productSearch.value.toLowerCase();
                const selectedCategory = categoryFilter.value;
                
                let matchCount = 0;
                tableRows.forEach(row => {
                    const productName = row.querySelector('.product-name').textContent.toLowerCase();
                    const productId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    const category = row.querySelector('td:nth-child(4)').textContent;
                    const brand = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                    
                    // Check if the row matches search term and category filter
                    const matchesSearch = productName.includes(searchTerm) || 
                                        productId.includes(searchTerm) || 
                                        brand.includes(searchTerm);
                    
                    const matchesCategory = selectedCategory === '' || category === selectedCategory;
                    
                    // Show or hide row based on filters
                    if (matchesSearch && matchesCategory) {
                        row.style.display = '';
                        matchCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                console.log(`Filter applied: ${matchCount} products match the criteria`);
            } catch (error) {
                console.error("Error filtering products:", error);
            }
        }
        
        // Setup button interactions
        function setupButtonInteractions() {
            // Add product button
            if (addProductBtn) {
                addProductBtn.addEventListener('click', function() {
                    openAddProductPanel();
                });
            }
            
            // Edit buttons
            const editButtons = document.querySelectorAll('.action-btn.edit');
            editButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const productId = row.querySelector('td:nth-child(2)').textContent;
                    alert(`Edit product ${productId}`);
                });
            });
            
            // Delete buttons
            const deleteButtons = document.querySelectorAll('.action-btn.delete');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const productId = row.querySelector('td:nth-child(2)').textContent;
                    const productName = row.querySelector('.product-name').textContent;
                    
                    if (confirm(`Are you sure you want to delete ${productName} (${productId})?`)) {
                        // This would typically call an API to delete the product
                        row.remove();
                    }
                });
            });
            
            // Barcode icons
            const barcodeIcons = document.querySelectorAll('.barcode i');
            barcodeIcons.forEach(icon => {
                icon.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const productId = row.querySelector('td:nth-child(2)').textContent;
                    const productName = row.querySelector('.product-name').textContent;
                    
                    alert(`Barcode for ${productName} (${productId}) would be displayed/printed here`);
                });
            });
            
            // Pagination buttons
            const paginationButtons = document.querySelectorAll('.page-btn');
            paginationButtons.forEach(btn => {
                if (!btn.classList.contains('prev') && !btn.classList.contains('next')) {
                    btn.addEventListener('click', function() {
                        document.querySelector('.page-btn.active').classList.remove('active');
                        this.classList.add('active');
                        // In a real app, this would load the corresponding page of products
                    });
                }
            });
            
            // Previous and Next buttons
            const prevButton = document.querySelector('.page-btn.prev');
            const nextButton = document.querySelector('.page-btn.next');
            
            prevButton.addEventListener('click', function() {
                const activeButton = document.querySelector('.page-btn.active');
                const prevPage = activeButton.previousElementSibling;
                
                if (prevPage && !prevPage.classList.contains('prev')) {
                    activeButton.classList.remove('active');
                    prevPage.classList.add('active');
                    // In a real app, this would load the previous page of products
                }
            });
            
            nextButton.addEventListener('click', function() {
                const activeButton = document.querySelector('.page-btn.active');
                const nextPage = activeButton.nextElementSibling;
                
                if (nextPage && !nextPage.classList.contains('next') && !nextPage.classList.contains('page-dots')) {
                    activeButton.classList.remove('active');
                    nextPage.classList.add('active');
                    // In a real app, this would load the next page of products
                }
            });
        }
        
        // Setup Add Product Panel
        function setupAddProductPanel() {
            // Close panel when clicking the close button
            if (closePanelBtn) {
                closePanelBtn.addEventListener('click', closeAddProductPanel);
            }
            
            // Close panel when clicking the cancel button
            if (cancelBtn) {
                cancelBtn.addEventListener('click', closeAddProductPanel);
            }
            
            // Close panel when clicking outside the panel
            if (panelOverlay) {
                panelOverlay.addEventListener('click', closeAddProductPanel);
            }
            
            // Handle image upload and preview
            if (productImageInput) {
                productImageInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            imagePreview.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
            
            // Handle form submission
            if (productForm) {
                productForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    saveProduct();
                });
            }
        }
        
        // Open Add Product Panel
        function openAddProductPanel() {
            if (addProductPanel && panelOverlay) {
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                panelOverlay.classList.add('active');
                addProductPanel.classList.add('active');
            }
        }
        
        // Close Add Product Panel
        function closeAddProductPanel() {
            if (addProductPanel && panelOverlay) {
                document.body.style.overflow = '';
                panelOverlay.classList.remove('active');
                addProductPanel.classList.remove('active');
                
                // Optional: Reset the form when closing
                if (productForm) {
                    productForm.reset();
                    imagePreview.src = 'https://via.placeholder.com/150?text=No+Image';
                }
            }
        }
        
        // Save Product
        function saveProduct() {
            // Get all form values
            const productId = document.getElementById('product-id').value;
            const productName = document.getElementById('product-name').value;
            const category = document.getElementById('product-category').value;
            const brand = document.getElementById('product-brand').value;
            const unit = document.getElementById('product-unit').value;
            const barcode = document.getElementById('product-barcode').value;
            const purchasePrice = document.getElementById('purchase-price').value;
            const sellingPrice = document.getElementById('selling-price').value;
            const currentStock = document.getElementById('current-stock').value;
            const reorderLevel = document.getElementById('reorder-level').value;
            const description = document.getElementById('product-description').value;
            
            // Validate required fields
            if (!productId || !productName || !category || !purchasePrice || !sellingPrice || !currentStock || !reorderLevel) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Here you would typically send this data to your server
            console.log('Saving new product:', {
                productId,
                productName,
                category,
                brand,
                unit,
                barcode,
                purchasePrice,
                sellingPrice,
                currentStock,
                reorderLevel,
                description,
                image: imagePreview.src !== 'https://via.placeholder.com/150?text=No+Image' ? 'Image uploaded' : 'No image'
            });
            
            // For demo purposes, we'll add the product to the table
            addProductToTable({
                id: productId,
                name: productName,
                category,
                brand,
                unit,
                purchasePrice,
                sellingPrice,
                currentStock,
                reorderLevel,
                image: imagePreview.src
            });
            
            // Close the panel
            closeAddProductPanel();
            
            // Show success message
            alert('Product added successfully!');
        }
        
        // Add product to table
        function addProductToTable(product) {
            const productsTable = document.querySelector('.products-table tbody');
            
            if (productsTable) {
                const newRow = document.createElement('tr');
                
                // Create table data cells
                newRow.innerHTML = `
                    <td class="product-image">
                        <img src="${product.image}" alt="Product Thumbnail">
                    </td>
                    <td>${product.id}</td>
                    <td class="product-name">${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.brand}</td>
                    <td>${product.unit}</td>
                    <td>₹${formatPrice(product.purchasePrice)}</td>
                    <td>₹${formatPrice(product.sellingPrice)}</td>
                    <td><span class="stock-level">${product.currentStock}</span></td>
                    <td>${product.reorderLevel}</td>
                    <td class="barcode"><i class="fas fa-barcode"></i></td>
                    <td class="actions">
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                // Add the new row to the table
                productsTable.appendChild(newRow);
                
                // Set stock level indicator for the new row
                const stockSpan = newRow.querySelector('.stock-level');
                const stockValue = parseInt(product.currentStock);
                const reorderLevel = parseInt(product.reorderLevel);
                
                if (stockValue <= reorderLevel * 0.5) {
                    stockSpan.classList.add('critical');
                } else if (stockValue <= reorderLevel) {
                    stockSpan.classList.add('warning');
                } else {
                    stockSpan.classList.add('sufficient');
                }
                
                // Add event listeners to the new row's buttons
                const editBtn = newRow.querySelector('.action-btn.edit');
                const deleteBtn = newRow.querySelector('.action-btn.delete');
                const barcodeIcon = newRow.querySelector('.barcode i');
                
                if (editBtn) {
                    editBtn.addEventListener('click', function() {
                        alert(`Edit product ${product.id}`);
                    });
                }
                
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function() {
                        if (confirm(`Are you sure you want to delete ${product.name} (${product.id})?`)) {
                            newRow.remove();
                        }
                    });
                }
                
                if (barcodeIcon) {
                    barcodeIcon.addEventListener('click', function() {
                        alert(`Barcode for ${product.name} (${product.id}) would be displayed/printed here`);
                    });
                }
            }
        }
        
        // Helper function to format price
        function formatPrice(price) {
            return parseFloat(price).toLocaleString('en-IN');
        }
        
        // Setup table sorting
        function setupTableSorting() {
            // Additional functionality: Make the table sortable
            const tableHeaders = productsTable.querySelectorAll('thead th');
            tableHeaders.forEach((header, index) => {
                // Skip the image, barcode and actions columns
                if (index === 0 || index === 10 || index === 11) return;
                
                header.style.cursor = 'pointer';
                header.title = 'Click to sort';
                
                header.addEventListener('click', function() {
                    sortTable(index);
                });
            });
            console.log("Table sorting initialized");
        }
        
        function sortTable(columnIndex) {
            let switching = true;
            let shouldSwitch, switchcount = 0;
            let direction = 'asc';
            
            while (switching) {
                switching = false;
                const rows = productsTable.rows;
                
                for (let i = 1; i < rows.length - 1; i++) {
                    shouldSwitch = false;
                    const x = rows[i].getElementsByTagName('td')[columnIndex];
                    const y = rows[i + 1].getElementsByTagName('td')[columnIndex];
                    
                    // Check if the two rows should switch
                    if (direction === 'asc') {
                        if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (direction === 'desc') {
                        if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
                
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount++;
                } else {
                    if (switchcount === 0 && direction === 'asc') {
                        direction = 'desc';
                        switching = true;
                    }
                }
            }
            
            // Update visual indication of sort direction
            tableHeaders.forEach(header => {
                header.classList.remove('sorted-asc', 'sorted-desc');
            });
            
            const currentHeader = tableHeaders[columnIndex];
            currentHeader.classList.add(direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    } catch (err) {
        console.error("Critical error initializing products page:", err);
        alert("There was an error loading the Products page. Please check the console for details.");
    }
});

// If we're on the index page, add a listener to the Products link
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log("Index page loaded - setting up Products link");
            const productsLink = document.querySelector('.sidebar-menu li a[href="products.html"]');
            
            if (productsLink) {
                console.log("Products link found, adding click handler");
                productsLink.addEventListener('click', function(e) {
                    console.log("Products link clicked, navigating to products.html");
                    // Add a class to indicate we're coming from a click (can be used for additional handling)
                    sessionStorage.setItem('productsLinkClicked', 'true');
                });
            } else {
                console.error("Products link not found in sidebar!");
            }
            
            // Also handle the Customers link
            const customersLink = document.querySelector('.sidebar-menu li a[href="customers.html"]');
            if (customersLink) {
                console.log("Customers link found, adding click handler");
                customersLink.addEventListener('click', function(e) {
                    console.log("Customers link clicked, navigating to customers.html");
                    // Store this click in sessionStorage so we can detect if we came from a click
                    sessionStorage.setItem('customersLinkClicked', 'true');
                });
            } else {
                console.error("Customers link not found in sidebar!");
            }
            
            // Also handle the Sales link
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
            console.error("Error setting up navigation links:", err);
        }
    });
} 