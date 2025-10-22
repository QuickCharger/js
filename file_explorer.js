const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const baseDir = path.resolve(__dirname, '.');
let port = 8080

const mime = {
  '.html': 'text/html; charset=UTF-8',
  '.css':  'text/css; charset=UTF-8',
  '.txt':  'text/plain; charset=UTF-8',
  '.md':   'text/markdown; charset=UTF-8',
  '.csv':  'text/csv; charset=UTF-8',
  '.js':   'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.xml':  'application/xml; charset=UTF-8',
  '.svg':  'image/svg+xml; charset=UTF-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  // 其他类型根据需要补充
};

function send500(res) {
  res.writeHead(500, {'Content-Type': 'text/plain; charset=UTF-8'});
  res.end('500 Internal Server Error');
}

function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain; charset=UTF-8'});
  res.end('404 Not Found');
}

async function handleRequest(req, res) {
  try{
    let reqUrl = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    // 处理结尾的斜杠，防止路径混乱
    if (reqUrl.length > 1 && reqUrl.endsWith('/')) reqUrl = reqUrl.slice(0, -1);

    let fsPath = path.join(baseDir, reqUrl);

    // 防止路径穿越
    if (!fsPath.startsWith(baseDir)) {
      send404(res);
      return;
    }

    let stats;
    try {
      stats = await fs.stat(fsPath);
    } catch {
      send404(res);
      return;
    }

    if (stats.isDirectory()) {
      let urlPath = reqUrl.endsWith('/') ? reqUrl : reqUrl + '/';
      const files = await fs.readdir(fsPath, { withFileTypes: true });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.write(`<h1>Index of ${urlPath}</h1><ul>`);
      if (urlPath !== '/') {
        const parentPath = path.posix.dirname(urlPath.endsWith('/') ? urlPath.slice(0,-1) : urlPath);
        console.log(`urlPath ${urlPath}`)
        console.log(`parentPath ${parentPath}`)
        res.write(`<li><a href="${parentPath === '.' ? '/' : parentPath}">.. (parent directory)</a></li>`);
      }
      for (const file of files) {
        let name = file.name;
        let slash = file.isDirectory() ? '/' : '';
        res.write(`<li><a href="${path.posix.join(urlPath, name)}${slash}">${name}${slash}</a></li>`);
      }
      res.end('</ul>');
    } else if (stats.isFile()) {
      let ext = path.extname(fsPath).toLowerCase();
      let type = mime[ext] || 'application/octet-stream';
      let data = await fs.readFile(fsPath);
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    } else {
      send404(res);
    }
  } catch {
    send500(res);
  }
}

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
