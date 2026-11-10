const https = require('https');

const COOLIFY_API = 'https://democrats-trusted-paperbacks-discussed.trycloudflare.com/api/v1';
const BEARER_TOKEN = '1|PgckSS43LyNPjaRzeTVbL6JbWx8XfstSXsGFIXRxa83508ba';

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${COOLIFY_API}${path}`);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function main() {
  const action = process.argv[2] || 'list';

  if (action === 'create-project') {
    const name = process.argv[3] || 'TEJAS Institute Platform';
    const description = process.argv[4] || 'Deep-Tech Engineering Institute, 18 Programs, Admissions CRM, GST Invoicing, Live Classroom & QA';
    const res = await request('POST', '/projects', { name, description });
    console.log(JSON.stringify(res, null, 2));
  } else if (action === 'list-projects') {
    const res = await request('GET', '/projects');
    console.log(JSON.stringify(res, null, 2));
  } else if (action === 'get-project') {
    const uuid = process.argv[3];
    const res = await request('GET', `/projects/${uuid}`);
    console.log(JSON.stringify(res, null, 2));
  } else if (action === 'create-app') {
    const payload = JSON.parse(process.argv[3]);
    const res = await request('POST', '/applications/public', payload);
    console.log(JSON.stringify(res, null, 2));
  } else if (action === 'deploy') {
    const uuid = process.argv[3];
    const res = await request('POST', `/deploy?uuid=${uuid}`);
    console.log(JSON.stringify(res, null, 2));
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
