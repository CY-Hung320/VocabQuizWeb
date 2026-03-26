const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML_FILE = path.join(__dirname, 'index.html');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.css':  'text/css',
  '.js':   'application/javascript',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const decoded = decodeURIComponent(urlPath);
  // Strip leading slashes/backslashes to get a clean relative filename
  const relative = decoded.replace(/^[\/\\]+/, '');
  const filePath = (!relative || relative === '')
    ? HTML_FILE
    : path.join(__dirname, path.normalize(relative).replace(/^(\.\.[\/\\])+/, ''));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ 伺服器已啟動：http://localhost:${PORT}`);
  console.log('等待 cloudflared 連線中...');
});
