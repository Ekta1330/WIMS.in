// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Main script loaded");
    
    // Replace John Doe with Ekta Sandhu in user profile
    updateUserProfile();
    
    // Set current year in the copyright notice if exists
    const copyrightYear = document.querySelector('.copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
    
    // Setup sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });
    }
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Enhance tab navigation reliability
    enhanceTabNavigation();
    
    // Initialize notification and message dropdowns
    initializeNotificationsAndMessages();
    
    // Function to set up sidebar navigation
    function setupSidebarNavigation() {
        try {
            // Get all sidebar menu items
            const sidebarItems = document.querySelectorAll('.sidebar-menu li a');
            
            // Add click event listeners
            sidebarItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    // If this is a direct link to a page, let the default navigation happen
                    if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                        // Store in session storage that this link was clicked
                        const page = this.getAttribute('href').replace('.html', '');
                        sessionStorage.setItem(`${page}LinkClicked`, 'true');
                        return; // Allow default navigation
                    }
                    
                    // Otherwise prevent default and handle the navigation manually
                    e.preventDefault();
                    
                    // Remove active class from all items
                    sidebarItems.forEach(i => i.parentElement.classList.remove('active'));
                    
                    // Add active class to clicked item
                    this.parentElement.classList.add('active');
                    
                    // Handle navigation based on the clicked item
                    const targetSection = this.textContent.trim().toLowerCase();
                    
                    // Navigate to appropriate section or show content
                    // This would typically involve showing/hiding sections or redirecting
                    console.log(`Navigating to ${targetSection}`);
                    
                    // Example of conditional navigation
                    if (targetSection === 'dashboard') {
                        window.location.href = 'index.html';
                    } else if (targetSection === 'products') {
                        window.location.href = 'products.html';
                    } else if (targetSection === 'customers') {
                        window.location.href = 'customers.html';
                    } else if (targetSection === 'sales') {
                        window.location.href = 'sales.html';
                    } else if (targetSection === 'supplier') {
                        window.location.href = 'suppliers.html';
                    }
                    // Add other sections as needed
                });
            });
            
            // Check if we should highlight a specific menu item based on the current page
            const currentPage = window.location.pathname.split('/').pop();
            
            if (currentPage) {
                const pageMap = {
                    'index.html': 'Dashboard',
                    'products.html': 'Products',
                    'customers.html': 'Customers', 
                    'sales.html': 'Sales',
                    'suppliers.html': 'Supplier'
                };
                
                const pageName = pageMap[currentPage];
                
                if (pageName) {
                    sidebarItems.forEach(item => {
                        if (item.textContent.trim() === pageName) {
                            item.parentElement.classList.add('active');
                        } else {
                            item.parentElement.classList.remove('active');
                        }
                    });
                }
            }
            
            console.log("Sidebar navigation setup complete");
        } catch (error) {
            console.error("Error setting up sidebar navigation:", error);
        }
    }

    // Revenue vs Costs Chart
    const revenueVsCostsChart = document.getElementById('revenueVsCostsChart').getContext('2d');
    new Chart(revenueVsCostsChart, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [18500, 19200, 21500, 22800, 24100, 25900, 27300, 28400, 30100, 31800, 33100, 34600],
                    borderColor: '#00b894',
                    backgroundColor: 'rgba(0, 184, 148, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#00b894',
                    pointRadius: 4,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Costs',
                    data: [15200, 16100, 17300, 18200, 19600, 20800, 21500, 22600, 24100, 25300, 26700, 28600],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#e74c3c',
                    pointRadius: 4,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 10,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ₹';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-IN').format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN', { 
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        }
                    }
                }
            }
        }
    });

    // Purchase Summary Chart
    const purchaseSummaryChart = document.getElementById('purchaseSummaryChart').getContext('2d');
    new Chart(purchaseSummaryChart, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Purchases',
                    data: [12500, 19200, 16800, 14300],
                    backgroundColor: [
                        'rgba(108, 92, 231, 0.8)',
                        'rgba(108, 92, 231, 0.6)',
                        'rgba(108, 92, 231, 0.4)',
                        'rgba(108, 92, 231, 0.2)'
                    ],
                    borderColor: [
                        'rgba(108, 92, 231, 1)',
                        'rgba(108, 92, 231, 1)',
                        'rgba(108, 92, 231, 1)',
                        'rgba(108, 92, 231, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ₹';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-IN').format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN', { 
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        }
                    }
                }
            }
        }
    });

    // Sales by Category Chart (Donut Chart)
    const categoryChart = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryChart, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Clothing', 'Furniture', 'Accessories', 'Food & Beverages'],
            datasets: [
                {
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#6c5ce7',
                        '#00b894',
                        '#fdcb6e',
                        '#fd79a8',
                        '#0984e3'
                    ],
                    borderWidth: 0,
                    hoverOffset: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Handle dropdown menu toggling
    const userProfile = document.querySelector('.user-profile');
    userProfile.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdownContent = this.querySelector('.dropdown-content');
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userProfile.contains(e.target)) {
            const dropdownContent = userProfile.querySelector('.dropdown-content');
            if (dropdownContent.style.display === 'block') {
                dropdownContent.style.display = 'none';
            }
        }
    });

    // Add mobile sidebar toggle functionality
    const body = document.querySelector('body');
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const hamburger = document.createElement('div');
        hamburger.classList.add('hamburger-menu');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.top-nav').prepend(hamburger);
        
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
});

// Function to load JavaScript dynamically
function loadScript(src, async = true, defer = true) {
    return new Promise((resolve, reject) => {
        try {
            const script = document.createElement('script');
            script.src = src;
            script.async = async;
            script.defer = defer;
            
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Script load error for ${src}`));
            
            document.head.appendChild(script);
        } catch (error) {
            reject(error);
        }
    });
}

// Helper function for debouncing events
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Helper function to format currency
function formatCurrency(amount, currency = '₹') {
    return `${currency}${parseFloat(amount).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    })}`;
}

// Helper function to format dates
function formatDate(dateString, format = 'long') {
    const date = new Date(dateString);
    
    if (isNaN(date)) {
        return 'Invalid Date';
    }
    
    if (format === 'long') {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else if (format === 'short') {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } else if (format === 'time') {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (format === 'datetime') {
        return `${date.toLocaleDateString('en-IN')} ${date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
    
    return date.toLocaleDateString('en-IN');
}

// Function to enhance tab navigation reliability
function enhanceTabNavigation() {
    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-menu li a');
    
    // Add direct click handlers to ensure navigation works
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's a direct page link, ensure we can navigate to it
            if (href && href !== '#') {
                // Remove any potential event propagation issues
                e.stopPropagation();
                
                // Get the current page
                const currentPage = window.location.pathname.split('/').pop();
                
                // Before navigating, clean up any open panels or overlays
                cleanupBeforeNavigation();
                
                // If we're trying to navigate to the current page, prevent default
                // and refresh the page to ensure a clean state
                if (href === currentPage) {
                    e.preventDefault();
                    window.location.reload();
                    return;
                }
                
                // Store click information for special case handling
                sessionStorage.setItem('lastClickedLink', href);
                
                // Let the default navigation happen
                // But ensure the link has proper target file
                if (href.indexOf('.html') === -1 && href !== '#') {
                    e.preventDefault();
                    window.location.href = href + '.html';
                }
            }
        }, true); // Use capture phase to ensure our handler runs first
    });
    
    // Handle special case for Stock Transfer link
    const stockTransferLink = document.querySelector('.sidebar-menu li a[href="stock-transfer.html"]');
    if (stockTransferLink) {
        stockTransferLink.addEventListener('click', function(e) {
            // Ensure proper navigation to stock transfer page
            e.preventDefault();
            
            // Clean up any open panels or overlays
            cleanupBeforeNavigation();
            
            sessionStorage.setItem('forcedStockTransferNavigation', 'true');
            window.location.href = 'stock-transfer.html';
        }, true); // Use capture phase to ensure our handler runs first
    }
    
    // Set active state based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            // Add active class to current link
            link.parentElement.classList.add('active');
        }
    });
    
    console.log('Tab navigation enhancement complete');
}

// Function to clean up any open panels or overlays before navigation
function cleanupBeforeNavigation() {
    // Close any open overlays
    const overlays = document.querySelectorAll('.panel-overlay, .modal-overlay');
    overlays.forEach(overlay => {
        if (overlay.classList.contains('active') || getComputedStyle(overlay).visibility === 'visible') {
            overlay.classList.remove('active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
        }
    });
    
    // Close any open panels
    const panels = document.querySelectorAll('.new-purchase-panel, .panel, .transfer-panel, .create-invoice-modal, .invoice-detail-modal');
    panels.forEach(panel => {
        if (panel.classList.contains('open') || panel.classList.contains('active')) {
            panel.classList.remove('open', 'active');
            
            // Reset panel position based on its type
            if (panel.classList.contains('new-purchase-panel')) {
                panel.style.right = '-800px';
            } else if (panel.classList.contains('transfer-panel')) {
                panel.style.right = '-450px';
            }
        }
    });
    
    // Ensure body scroll is enabled
    document.body.style.overflow = '';
    
    console.log('Cleaned up panels and overlays before navigation');
}

// Function to initialize notification and message dropdowns
function initializeNotificationsAndMessages() {
    const notification = document.querySelector('.notification');
    const messages = document.querySelector('.messages');
    
    if (!notification || !messages) return;
    
    // Notification click handler
    notification.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Toggle active class for dropdown visibility
        this.classList.toggle('active');
        
        // Close messages dropdown if open
        if (messages.classList.contains('active')) {
            messages.classList.remove('active');
        }
    });
    
    // Messages click handler
    messages.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Toggle active class for dropdown visibility
        this.classList.toggle('active');
        
        // Close notification dropdown if open
        if (notification.classList.contains('active')) {
            notification.classList.remove('active');
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!notification.contains(e.target) && !messages.contains(e.target)) {
            notification.classList.remove('active');
            messages.classList.remove('active');
        }
    });
    
    // "Mark all as read" functionality
    const markAllReadButtons = document.querySelectorAll('.mark-all-read');
    markAllReadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Determine which dropdown this button belongs to
            const parent = this.closest('.dropdown-content');
            if (parent.classList.contains('notification-dropdown')) {
                // Mark all notifications as read
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                
                // Update badge count
                const badge = notification.querySelector('.badge');
                badge.textContent = '0';
                
                // Hide badge if count is zero
                if (badge.textContent === '0') {
                    badge.style.display = 'none';
                }
            } else if (parent.classList.contains('messages-dropdown')) {
                // Mark all messages as read
                document.querySelectorAll('.message-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                
                // Update badge count
                const badge = messages.querySelector('.badge');
                badge.textContent = '0';
                
                // Hide badge if count is zero
                if (badge.textContent === '0') {
                    badge.style.display = 'none';
                }
            }
        });
    });
    
    // Individual notification/message item click
    const notificationItems = document.querySelectorAll('.notification-item, .message-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Don't trigger if already read
            if (!this.classList.contains('unread')) return;
            
            // Mark this item as read by removing unread class
            this.classList.remove('unread');
            
            // Update the badge count
            const isNotification = this.classList.contains('notification-item');
            const container = isNotification ? notification : messages;
            const badge = container.querySelector('.badge');
            
            let count = parseInt(badge.textContent);
            if (!isNaN(count) && count > 0) {
                count--;
                badge.textContent = count.toString();
                
                // Hide badge if count is zero
                if (count === 0) {
                    badge.style.display = 'none';
                }
            }
            
            // Show a toast message if the function exists
            if (typeof showToast === 'function') {
                const message = isNotification 
                    ? 'Notification marked as read' 
                    : 'Message marked as read';
                showToast(message);
            }
        });
    });
}

// Function to update user profile
function updateUserProfile() {
    // Find user profile elements
    const userProfileName = document.querySelector('.user-profile .dropdown span');
    const userProfileImage = document.querySelector('.user-profile img');
    
    // Update name and profile image
    if (userProfileName) {
        userProfileName.textContent = 'Ekta Sandhu';
    }
    
    if (userProfileImage) {
        userProfileImage.src = 'https://randomuser.me/api/portraits/women/33.jpg';
    }
} 