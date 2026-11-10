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

async function run() {
  const payload = {
    project_uuid: '84jiu8b36hiwwadjnboprj8g',
    server_uuid: '4rtzaoervomu6lxhys14yu1d',
    environment_name: 'production',
    git_repository: 'https://github.com/ashokmallick1/tejas-institute',
    git_branch: 'main',
    build_pack: 'dockerfile',
    ports_exposes: '3004',
    destination_uuid: 'ji7ym863ucthnmtrv04fsjab'
  };

  console.log('Sending payload to Coolify /applications/public:');
  console.log(JSON.stringify(payload, null, 2));

  const res = await request('POST', '/applications/public', payload);
  console.log('\nResponse status:', res.status);
  console.log('Response body:', JSON.stringify(res.data || res.raw, null, 2));
}

run().catch(console.error);
