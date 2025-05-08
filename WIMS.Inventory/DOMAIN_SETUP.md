# Setting Up Custom Domain for WIMS

This guide will help you configure your system to use the custom domain `WIMS.org` for local development and production deployment.

## Local Development Setup

### 1. Modify Your Hosts File

To make your computer recognize `WIMS.org` as a local domain, you need to modify your hosts file:

#### Windows
1. Open Notepad as Administrator
2. Open the file: `C:\Windows\System32\drivers\etc\hosts`
3. Add this line at the end:
   ```
   127.0.0.1    WIMS.org
   ```
4. Save the file

#### macOS/Linux
1. Open Terminal
2. Run: `sudo nano /etc/hosts`
3. Add this line at the end:
   ```
   127.0.0.1    WIMS.org
   ```
4. Save with Ctrl+O, then exit with Ctrl+X

### 2. Start the Application with Custom Hostname

Run the application with the HOSTNAME environment variable:

```bash
# Windows PowerShell
$env:HOSTNAME="WIMS.org"; npm start

# Windows Command Prompt
set HOSTNAME=WIMS.org && npm start

# macOS/Linux
HOSTNAME=WIMS.org npm start
```

## Production Deployment

For production deployment, you'll need to:

1. Purchase the domain `WIMS.org` from a domain registrar
2. Set up a web server (like Nginx or Apache) to proxy requests to your Node.js application
3. Configure SSL certificates for secure HTTPS connections

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name WIMS.org www.WIMS.org;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Using with Docker

If you're using Docker, you can set the hostname in your docker-compose.yml:

```yaml
version: '3'
services:
  wims-app:
    build: .
    environment:
      - PORT=3000
      - HOSTNAME=WIMS.org
    ports:
      - "80:3000"
```

## Accessing the Application

After setup, you can access your application at:
- http://WIMS.org/
- http://WIMS.org/reports.html
- http://WIMS.org/products.html
- etc. 