@echo off
title VocabQuiz Launcher

start "Web Server" cmd /k "node %~dp0server.js"
timeout /t 2 /nobreak > nul
start "Cloudflare Tunnel - Copy the https URL for your family" cmd /k "npx cloudflared@latest tunnel --url http://localhost:3000"

echo Both windows opened.
echo Look at the Tunnel window for the https://xxxx.trycloudflare.com URL.
pause
