# WIMS.Inventory - Warehouse Inventory Management System

A comprehensive web-based warehouse inventory management system with features for tracking products, managing inventory, handling sales and purchases, generating invoices, and creating reports.

## Custom Domain Setup

To access the application using the custom domain `WIMS.org` (e.g., http://WIMS.org/reports.html), follow these steps:

### Windows Setup

1. Edit your hosts file:
   - Open Notepad as Administrator
   - Open the file: `C:\Windows\System32\drivers\etc\hosts`
   - Add this line at the end: `127.0.0.1    WIMS.org`
   - Save the file

2. Start the application with custom domain:
   - Run the provided batch file: `start-custom-domain.bat`
   - Or use the npm script: `npm run start:custom-domain`

### macOS/Linux Setup

1. Edit your hosts file:
   - Open Terminal
   - Run: `sudo nano /etc/hosts`
   - Add this line: `127.0.0.1    WIMS.org`
   - Save with Ctrl+O, then exit with Ctrl+X

2. Start the application with custom domain:
   - Make the script executable: `chmod +x start-custom-domain.sh`
   - Run the script: `./start-custom-domain.sh`
   - Or use the npm script: `sudo npm run start:custom-domain`

For more detailed instructions, refer to the [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) file.

## Project Structure

```
WIMS.Inventory/
│
├── templates/                  # HTML templates
│   ├── index.html             # Dashboard/home page
│   ├── products.html          # Products management
│   ├── customers.html         # Customer management
│   ├── suppliers.html         # Supplier management
│   ├── sales.html             # Sales tracking
│   ├── purchases.html         # Purchase management
│   ├── invoice-bills.html     # Invoice & Bills management
│   ├── stock-transfer.html    # Stock transfer operations
│   └── reports.html           # Reporting system
│
├── static/                     # Static assets
│   ├── css/                   # Stylesheets
│   │   ├── styles.css         # Global styles
│   │   ├── reports.css        # Reports panel styles
│   │   ├── invoice-bills.css  # Invoice panel styles
│   │   └── ...                # Other CSS files
│   │
│   ├── js/                    # JavaScript files
│   │   ├── script.js          # Global scripts
│   │   ├── reports.js         # Reports functionality
│   │   ├── invoice-bills.js   # Invoice functionality
│   │   └── ...                # Other JS files
│   │
│   └── images/                # Image assets
│
├── backend/                    # Backend code
│   ├── report-generator.js    # Report generation API
│   ├── pdf-generator.js       # PDF generation service
│   ├── package.json           # Backend dependencies
│   └── package-lock.json      # Backend dependency lock file
│
├── data/                       # Data storage
│
├── reports/                    # Generated reports
│
├── invoices/                   # Generated invoices
│
├── index.js                    # Main application entry point
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Features

- **Dashboard**: Overview of key metrics and system status
- **Products Management**: Add, edit, and manage product inventory
- **Customer Management**: Track customer information and purchase history
- **Supplier Management**: Manage supplier details and order history
- **Sales Tracking**: Record and monitor sales transactions
- **Purchase Management**: Track and manage purchase orders
- **Invoice & Bills**: Generate and manage invoices and bills
- **Stock Transfer**: Manage movement of inventory between locations
- **Reports Panel**: Generate comprehensive reports with visualizations and download options

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```
4. Access the application at http://localhost:3000

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Reporting**: Chart.js for data visualization
- **PDF Generation**: Custom HTML-to-PDF solution

## Developer

- Ekta Sandhu

## License

This project is licensed under the MIT License. 