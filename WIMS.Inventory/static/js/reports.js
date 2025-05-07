document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports module loaded');
    
    // Initialize charts
    initializeCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set current month and year in selectors
    setCurrentDateInSelectors();
    
    // Initialize tab functionality
    initializeTabs();

    // Initialize notification and message dropdowns
    initializeNotificationsAndMessages();
});

// Function to initialize notification and message dropdowns
function initializeNotificationsAndMessages() {
    const notification = document.querySelector('.notification');
    const messages = document.querySelector('.messages');
    
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
            
            // Mark this item as read by removing unread class
            this.classList.remove('unread');
            
            // Update the badge count
            const isNotification = this.classList.contains('notification-item');
            const container = isNotification ? notification : messages;
            const badge = container.querySelector('.badge');
            
            // Only decrement badge if the item was unread
            if (this.classList.contains('unread')) {
                let count = parseInt(badge.textContent);
                if (!isNaN(count) && count > 0) {
                    count--;
                    badge.textContent = count.toString();
                    
                    // Hide badge if count is zero
                    if (count === 0) {
                        badge.style.display = 'none';
                    }
                }
            }
            
            // Show a toast message to confirm the action
            const message = isNotification 
                ? 'Notification marked as read' 
                : 'Message marked as read';
            showToast(message);
        });
    });
}

// Initialize charts with Chart.js
function initializeCharts() {
    // Monthly Distribution Pie Chart
    initializeMonthlyDistributionChart();
    
    // Top Categories Doughnut Chart
    initializeTopCategoriesChart();
    
    // Trend Analysis Chart
    initializeTrendAnalysisChart();
    
    // Set initial chart sizes
    setTimeout(responsiveCharts, 100);
}

// Monthly Distribution Pie Chart
function initializeMonthlyDistributionChart() {
    const ctx = document.getElementById('monthlyDistributionChart').getContext('2d');
    
    window.monthlyDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Sales', 'Purchases', 'Returns', 'Stock Transfer'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#4299e1', // Sales - Blue
                    '#48bb78', // Purchases - Green
                    '#ed8936', // Returns - Orange
                    '#9f7aea'  // Stock Transfer - Purple
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 15
            }]
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
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (₹${formatCurrency(getMoneyValueFromPercentage(value, total))})`;
                        }
                    }
                }
            }
        }
    });
}

// Top Categories Doughnut Chart
function initializeTopCategoriesChart() {
    const ctx = document.getElementById('topCategoriesChart').getContext('2d');
    
    window.topCategoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Clothing', 'Furniture', 'Accessories', 'Others'],
            datasets: [{
                data: [42, 23, 18, 12, 5],
                backgroundColor: [
                    '#4299e1', // Electronics - Blue
                    '#48bb78', // Clothing - Green
                    '#ed8936', // Furniture - Orange
                    '#9f7aea', // Accessories - Purple
                    '#a0aec0'  // Others - Gray
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (₹${formatCurrency(getMoneyValueFromPercentage(value, total))})`;
                        }
                    }
                }
            }
        }
    });
}

// Trend Analysis Chart
function initializeTrendAnalysisChart() {
    const ctx = document.getElementById('trendAnalysisChart').getContext('2d');
    
    // Get selected time period
    const timePeriod = document.querySelector('.time-period-btn.active').getAttribute('data-period');
    const dataType = document.getElementById('trend-data-type').value;
    
    // Generate chart data based on time period and data type
    const chartData = generateChartData(timePeriod, dataType);
    
    window.trendAnalysisChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: capitalizeFirstLetter(dataType),
                data: chartData.values,
                backgroundColor: getGradient(ctx, '#4299e1', '#3182ce'),
                borderColor: '#3182ce',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: chartData.barThickness
            }]
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
                            const label = context.dataset.label || '';
                            return `${label}: ₹${formatCurrency(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Date Range selector
    const dateRangeSelect = document.getElementById('date-range');
    const dateInputsContainer = document.querySelector('.date-inputs');
    
    dateRangeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            dateInputsContainer.style.display = 'flex';
        } else {
            dateInputsContainer.style.display = 'none';
        }
    });
    
    // Month and Year selectors for Monthly Reports
    const monthSelector = document.getElementById('month-selector');
    const yearSelector = document.getElementById('year-selector');
    
    monthSelector.addEventListener('change', updateMonthlyCharts);
    yearSelector.addEventListener('change', updateMonthlyCharts);
    
    // Time period buttons for Trend Analysis
    const timePeriodBtns = document.querySelectorAll('.time-period-btn');
    
    timePeriodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            timePeriodBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart with new time period
            updateTrendAnalysisChart();
        });
    });
    
    // Trend data type selector
    const trendDataType = document.getElementById('trend-data-type');
    
    trendDataType.addEventListener('change', updateTrendAnalysisChart);
    
    // Apply filters button
    const applyFiltersBtn = document.querySelector('.apply-filters-btn');
    
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    // Download report buttons
    const downloadPdf = document.getElementById('download-pdf');
    const downloadExcel = document.getElementById('download-excel');
    const downloadCsv = document.getElementById('download-csv');
    
    downloadPdf.addEventListener('click', function(e) {
        e.preventDefault();
        downloadReport('pdf');
    });
    
    downloadExcel.addEventListener('click', function(e) {
        e.preventDefault();
        downloadReport('excel');
    });
    
    downloadCsv.addEventListener('click', function(e) {
        e.preventDefault();
        downloadReport('csv');
    });
    
    // Export detailed reports button
    const exportDetailedBtn = document.querySelector('.export-detailed-btn');
    
    exportDetailedBtn.addEventListener('click', function() {
        // Get the active tab content
        const activeTab = document.querySelector('.tab-content.active');
        const reportType = activeTab.id;
        
        downloadReport('excel', reportType);
    });
    
    // Window resize event for responsive charts
    window.addEventListener('resize', responsiveCharts);
}

// Set current month and year in selectors
function setCurrentDateInSelectors() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthSelector = document.getElementById('month-selector');
    const yearSelector = document.getElementById('year-selector');
    
    // Set current month
    monthSelector.value = currentMonth;
    
    // Set current year or add it if not exists
    let yearExists = false;
    for (let i = 0; i < yearSelector.options.length; i++) {
        if (parseInt(yearSelector.options[i].value) === currentYear) {
            yearExists = true;
            yearSelector.selectedIndex = i;
            break;
        }
    }
    
    if (!yearExists && yearSelector.options.length > 0) {
        const option = document.createElement('option');
        option.value = currentYear.toString();
        option.textContent = currentYear.toString();
        yearSelector.insertBefore(option, yearSelector.firstChild);
        yearSelector.selectedIndex = 0;
    }
}

// Update Monthly Charts based on selected month and year
function updateMonthlyCharts() {
    const monthSelector = document.getElementById('month-selector');
    const yearSelector = document.getElementById('year-selector');
    
    const selectedMonth = parseInt(monthSelector.value);
    const selectedYear = parseInt(yearSelector.value);
    
    // Update card values
    updateMonthlyCards(selectedMonth, selectedYear);
    
    // Generate new data for charts
    const monthlyData = generateMonthlyData(selectedMonth, selectedYear);
    
    // Update Monthly Distribution Chart
    if (window.monthlyDistributionChart) {
        window.monthlyDistributionChart.data.datasets[0].data = monthlyData.distribution;
        window.monthlyDistributionChart.update();
    }
    
    // Update Top Categories Chart
    if (window.topCategoriesChart) {
        window.topCategoriesChart.data.datasets[0].data = monthlyData.categories;
        window.topCategoriesChart.update();
    }
}

// Update Trend Analysis Chart
function updateTrendAnalysisChart() {
    const timePeriod = document.querySelector('.time-period-btn.active').getAttribute('data-period');
    const dataType = document.getElementById('trend-data-type').value;
    
    // Generate new chart data
    const chartData = generateChartData(timePeriod, dataType);
    
    // Update the chart
    if (window.trendAnalysisChart) {
        window.trendAnalysisChart.data.labels = chartData.labels;
        window.trendAnalysisChart.data.datasets[0].label = capitalizeFirstLetter(dataType);
        window.trendAnalysisChart.data.datasets[0].data = chartData.values;
        window.trendAnalysisChart.data.datasets[0].barThickness = chartData.barThickness;
        window.trendAnalysisChart.update();
    }
}

// Initialize tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Apply filters to reports
function applyFilters() {
    const reportType = document.getElementById('report-type').value;
    const dateRange = document.getElementById('date-range').value;
    let startDate, endDate;
    
    if (dateRange === 'custom') {
        startDate = document.getElementById('date-from').value;
        endDate = document.getElementById('date-to').value;
        
        if (!startDate || !endDate) {
            alert('Please select both start and end dates for custom range');
            return;
        }
    }
    
    // Show loading state
    document.querySelector('.apply-filters-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button text
        document.querySelector('.apply-filters-btn').innerHTML = '<i class="fas fa-filter"></i> Apply Filters';
        
        // Update UI with filtered data
        updateFilteredReports(reportType, dateRange, startDate, endDate);
        
        // Show success toast
        showToast('Filters applied successfully');
    }, 800);
}

// Update UI with filtered report data
function updateFilteredReports(reportType, dateRange, startDate, endDate) {
    // In a real app, this would fetch data from the server based on the filters
    console.log(`Filtering reports - Type: ${reportType}, Range: ${dateRange}, Start: ${startDate}, End: ${endDate}`);
    
    // For demo, we'll just update some values
    const filterDescription = getFilterDescription(dateRange, startDate, endDate);
    
    // Update section headers to show active filters
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    sectionHeaders.forEach(header => {
        const originalText = header.textContent.split(' - ')[0];
        header.textContent = `${originalText} - ${filterDescription}`;
    });
    
    // Update detailed reports based on report type
    if (reportType !== 'all') {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${reportType}-report"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
}

// Get filter description for display
function getFilterDescription(dateRange, startDate, endDate) {
    switch (dateRange) {
        case 'today':
            return 'Today';
        case 'week':
            return 'This Week';
        case 'month':
            return 'This Month';
        case 'quarter':
            return 'This Quarter';
        case 'year':
            return 'This Year';
        case 'custom':
            return `${formatDate(startDate)} to ${formatDate(endDate)}`;
        default:
            return 'All Time';
    }
}

// Download report
function downloadReport(format, reportType) {
    // Show download started toast
    const downloadStartedToast = document.querySelector('.toast.download-started');
    downloadStartedToast.classList.add('show');
    
    // Simulate API call to generate report
    setTimeout(() => {
        // Hide download started toast
        downloadStartedToast.classList.remove('show');
        
        // Check if download was successful (simulate random success/failure)
        if (Math.random() > 0.1) { // 90% success rate
            // Show download complete toast
            const downloadCompleteToast = document.querySelector('.toast.download-complete');
            downloadCompleteToast.classList.add('show');
            
            // Generate filename
            const reportName = reportType ? `${reportType.replace('-report', '')}` : 'complete';
            const date = new Date().toISOString().slice(0, 10);
            const filename = `${reportName}_report_${date}.${format}`;
            
            // Simulate file download by creating a temporary anchor element
            simulateDownload(filename, format);
            
            // Hide complete toast after 3 seconds
            setTimeout(() => {
                downloadCompleteToast.classList.remove('show');
            }, 3000);
        } else {
            // Show error toast
            const downloadErrorToast = document.querySelector('.toast.download-error');
            downloadErrorToast.classList.add('show');
            
            // Hide error toast after 3 seconds
            setTimeout(() => {
                downloadErrorToast.classList.remove('show');
            }, 3000);
        }
    }, 2000);
}

// Simulate file download
function simulateDownload(filename, format) {
    // In a real app, this would trigger a real download from the server
    // For demo purposes, we'll just log the download info
    console.log(`Downloading ${filename}`);
    
    // Create a temporary link to simulate download
    const link = document.createElement('a');
    link.href = `data:application/${format};charset=utf-8,Report%20data%20would%20go%20here`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Generate chart data based on time period and data type
function generateChartData(timePeriod, dataType) {
    let labels = [];
    let values = [];
    let barThickness = 'flex';
    
    // Generate labels based on time period
    switch (timePeriod) {
        case 'day':
            labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
            barThickness = 20;
            break;
        case 'week':
            labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            barThickness = 30;
            break;
        case 'month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            barThickness = 60;
            break;
        case 'year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            barThickness = 30;
            break;
    }
    
    // Generate random values based on data type
    const baseValue = dataType === 'sales' ? 50000 : dataType === 'purchases' ? 40000 : dataType === 'inventory' ? 80000 : 25000;
    
    values = labels.map(() => {
        // Add some randomness for realistic data
        return baseValue * (0.5 + Math.random());
    });
    
    return {
        labels,
        values,
        barThickness
    };
}

// Generate monthly data for charts
function generateMonthlyData(month, year) {
    // This would normally come from an API call
    // For demo, we'll generate random data based on month and year
    
    // Seed a deterministic random based on month and year
    const seed = month + year * 12;
    const randomFactor = ((seed * 9301 + 49297) % 233280) / 233280;
    
    const distribution = [
        45 + Math.floor(randomFactor * 10),
        30 + Math.floor(randomFactor * 10),
        15 - Math.floor(randomFactor * 5),
        10 - Math.floor(randomFactor * 5)
    ];
    
    const categories = [
        42 + Math.floor(randomFactor * 8),
        23 + Math.floor(randomFactor * 5),
        18 - Math.floor(randomFactor * 3),
        12 - Math.floor(randomFactor * 2),
        5
    ];
    
    return {
        distribution,
        categories
    };
}

// Update monthly cards based on selected month and year
function updateMonthlyCards(month, year) {
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Compare to selected month and year
    const isPast = (year < currentYear) || (year === currentYear && month < currentMonth);
    const isFuture = (year > currentYear) || (year === currentYear && month > currentMonth);
    
    const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
    
    // Get random values based on month and year seed
    const seed = month + year * 12;
    const randomFactor = ((seed * 9301 + 49297) % 233280) / 233280;
    
    // Update card values with randomized data
    const salesValue = Math.floor(300000 + randomFactor * 100000);
    const purchasesValue = Math.floor(200000 + randomFactor * 100000);
    const returnsValue = Math.floor(20000 + randomFactor * 25000);
    const profitValue = salesValue - purchasesValue - returnsValue;
    
    // Update card texts
    document.querySelector('.report-card:nth-child(1) .report-card-value').textContent = `₹${formatCurrency(salesValue)}`;
    document.querySelector('.report-card:nth-child(2) .report-card-value').textContent = `₹${formatCurrency(purchasesValue)}`;
    document.querySelector('.report-card:nth-child(3) .report-card-value').textContent = `₹${formatCurrency(returnsValue)}`;
    document.querySelector('.report-card:nth-child(4) .report-card-value').textContent = `₹${formatCurrency(profitValue)}`;
    
    // Update change percentages (comparing to previous month)
    function getChange(base, range) {
        // Generate deterministic change percentage based on month
        const prevSeed = (month === 0 ? (year - 1) * 12 + 11 : month - 1 + year * 12);
        const prevFactor = ((prevSeed * 9301 + 49297) % 233280) / 233280;
        
        const currentValue = base + randomFactor * range;
        const prevValue = base + prevFactor * range;
        const change = ((currentValue - prevValue) / prevValue) * 100;
        
        return change.toFixed(1);
    }
    
    const salesChange = getChange(300000, 100000);
    const purchasesChange = getChange(200000, 100000);
    const returnsChange = getChange(20000, 25000);
    const profitChange = getChange(80000, 20000);
    
    updateCardChange('.report-card:nth-child(1) .report-card-change', salesChange, true);
    updateCardChange('.report-card:nth-child(2) .report-card-change', purchasesChange, false);
    updateCardChange('.report-card:nth-child(3) .report-card-change', returnsChange, false);
    updateCardChange('.report-card:nth-child(4) .report-card-change', profitChange, true);
}

// Update card change indicators
function updateCardChange(selector, changeValue, isHigherBetter) {
    const changeElement = document.querySelector(selector);
    const changeNum = parseFloat(changeValue);
    
    // For some metrics, higher is better (sales, profit)
    // For others, lower is better (purchases, returns)
    const isPositive = isHigherBetter ? (changeNum > 0) : (changeNum < 0);
    
    changeElement.classList.remove('positive', 'negative');
    changeElement.classList.add(isPositive ? 'positive' : 'negative');
    
    const icon = isPositive ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>';
    changeElement.innerHTML = `${icon} ${Math.abs(changeNum)}% from last month`;
}

// Make charts responsive
function responsiveCharts() {
    if (window.monthlyDistributionChart) {
        window.monthlyDistributionChart.resize();
    }
    
    if (window.topCategoriesChart) {
        window.topCategoriesChart.resize();
    }
    
    if (window.trendAnalysisChart) {
        window.trendAnalysisChart.resize();
    }
}

// Get gradient for chart
function getGradient(ctx, colorStart, colorEnd) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// Show toast message
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon success"><i class="fas fa-check-circle"></i></div>
        <div class="toast-content">
            <p>${message}</p>
        </div>
    `;
    
    // Add toast to container
    const toastContainer = document.querySelector('.toast-container');
    toastContainer.appendChild(toast);
    
    // Show toast after a small delay
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Format currency
function formatCurrency(value) {
    return Math.round(value).toLocaleString('en-IN');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to convert percentage to money value
function getMoneyValueFromPercentage(percentage, total) {
    const totalValue = 345780; // From the card: Total Sales
    return (percentage / total) * totalValue;
} 