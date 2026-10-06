const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../public');
const {buildLanding} = require('./build-landing.cjs');
const {syncGalleries} = require('./sync-galleries.cjs');
const port = Number(process.env.PORT || 5173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};

const localAdminPath=path.resolve(__dirname,'../.local/admin/server.cjs');
const localAdmin=require('node:fs').existsSync(localAdminPath)?require(localAdminPath).createAdmin({projectRoot:path.resolve(__dirname,'..'),port}):null;
http.createServer(async (request,response) => {
  if(localAdmin){const localUrl=new URL(request.url,'http://localhost');if(await localAdmin(request,response,localUrl))return;}
  if (!['GET','HEAD'].includes(request.method)) {
    response.writeHead(405, {'Allow':'GET, HEAD'});
    return response.end();
  }
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/' || url.pathname === '/index.html') buildLanding();
    if (url.pathname === '/data/achievements.json') syncGalleries();
    const filePath = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (filePath !== root && !filePath.startsWith(root + path.sep)) {
      response.writeHead(403);
      return response.end('Forbidden');
    }
    let file = filePath;
    const stat = await fs.stat(file);
    if (stat.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(301, {'Location':url.pathname + '/' + url.search});
        return response.end();
      }
      file = path.join(file,'index.html');
    }
    const data = await fs.readFile(file);
    response.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      response.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
      const page = await fs.readFile(path.join(root,'404.html'));
      response.end(request.method === 'HEAD' ? undefined : page);
    } else {
      response.writeHead(400);
      response.end('Invalid request');
    }
  }
}).on('error', error => {
  console.error('Không thể chạy local server:',error.message);
  process.exitCode = 1;
}).listen(port,'127.0.0.1',() => {
  console.log('Panda Robotics: http://127.0.0.1:' + port);
  console.log('Countdown: http://127.0.0.1:' + port + '/vex-countdown/');
});
