@echo off
echo Starting WIMS.Inventory with custom domain WIMS.org
echo.
echo IMPORTANT: Make sure you've added the following line to your hosts file:
echo 127.0.0.1    WIMS.org
echo.
echo To edit your hosts file, run Notepad as Administrator and open:
echo C:\Windows\System32\drivers\etc\hosts
echo.
echo Press any key to continue...
pause > nul

npm install
npm run start:custom-domain 