#!/bin/bash

echo "Starting WIMS.Inventory with custom domain WIMS.org"
echo ""
echo "IMPORTANT: Make sure you've added the following line to your hosts file:"
echo "127.0.0.1    WIMS.org"
echo ""
echo "To edit your hosts file, run the following command:"
echo "sudo nano /etc/hosts"
echo ""
echo "Press any key to continue..."
read -n 1 -s

npm install
sudo npm run start:custom-domain 