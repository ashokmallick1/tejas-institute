const https = require('https');

const COOLIFY_API = 'https://democrats-trusted-paperbacks-discussed.trycloudflare.com/api/v1';
const BEARER_TOKEN = '1|PgckSS43LyNPjaRzeTVbL6JbWx8XfstSXsGFIXRxa83508ba';
const APP_UUID = 'ehasyzlyv4xiqcregfvcjasu';

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

async function configureEnvs() {
  const envs = [
    { key: 'PORT', value: '3004' },
    { key: 'NODE_ENV', value: 'production' },
    { key: 'NEXT_PUBLIC_DEMO_MODE', value: 'true' },
    { key: 'NEXT_TELEMETRY_DISABLED', value: '1' }
  ];

  for (const env of envs) {
    const res = await request('POST', `/applications/${APP_UUID}/envs`, env);
    console.log(`Configured ${env.key}=${env.value}:`, res.status);
  }
}

configureEnvs().catch(console.error);
