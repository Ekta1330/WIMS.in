<<<<<<< HEAD
# Warehouse Inventory Management System

A comprehensive dashboard for warehouse and inventory management with features for product management, sales, purchases, inventory tracking, stock transfers, and reports.

## Features

- **Dashboard**: Overview of sales, purchases, inventory levels and key metrics
- **Products**: Product management with categories, pricing, and stock levels
- **Customers**: Customer database with contact information and purchase history
- **Sales**: Sales tracking and invoicing system
- **Suppliers**: Supplier management with purchase history
- **Purchases**: Purchase order management
- **Invoice & Bills**: Invoice generation and bill tracking
- **Stock Transfer**: Manage stock transfers between locations with visual path indicators
- **Reports**: Comprehensive reporting system with interactive charts and data export

## Reports Panel

The Reports panel provides a comprehensive and visually engaging overview of all business data with the following features:

- **Download Reports**: Generate and download reports in PDF, Excel, or CSV formats
- **Monthly Reports**: Interactive pie chart showing distribution of sales, purchases, returns, and stock transfers
- **Category Analysis**: Doughnut chart displaying sales distribution across product categories
- **Trend Analysis**: Dynamic bar graph that shows performance metrics (sales, purchases, inventory, invoices) across different time frames (day, week, month, year)
- **Detailed Reports**: Tabular data for inventory, sales, purchases, and financial reports
- **Key Insights**: Quick snapshot of important metrics and trends

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/inventory-dashboard.git
   cd inventory-dashboard
   ```

2. Start a local server to view the frontend:
   ```
   # Using Python
   python -m http.server
   
   # OR using Node.js
   npx serve
   ```

3. To run the server for report generation:
   ```
   cd server
   npm install
   npm start
   ```

4. Access the application at:
   ```
   http://localhost:8000  # If using Python server
   http://localhost:3000  # If using Node.js serve or the report generator server
   ```

## Server API Endpoints

The server provides the following endpoints for report generation:

- `POST /api/reports/pdf`: Generate a PDF report
- `POST /api/reports/excel`: Generate an Excel report
- `POST /api/reports/csv`: Generate a CSV report
- `GET /api/reports/data`: Get data for reports based on type and date range

## Technologies Used

- HTML5, CSS3, JavaScript
- Chart.js for data visualization
- Font Awesome for icons
- Express.js for the server
- Responsive design for all screen sizes

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
=======
# WIMS.in
>>>>>>> 5aeb1cc3f8dc9c48f5f2fdf9d60eed8038a542e2
