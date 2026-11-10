const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      targets = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9222/json', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
      if (targets && targets.length) break;
    } catch (e) {}
  }

  if (!targets) {
    console.error('Could not connect to Edge');
    proc.kill();
    return;
  }

  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    const id = idCounter++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  const baseDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d02ca969-bf82-484f-9595-f6790db8ef7f\\screenshots';

  // 1. Desktop CRM Snapshot (1280x900)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: 'http://localhost:3002/crm' });
  await new Promise(r => setTimeout(r, 2500));
  let screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(baseDir, 'crm_desktop.png'), Buffer.from(screenshot.data, 'base64'));
  console.log('Saved crm_desktop.png');

  // 2. Mobile CRM Snapshot (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await send('Page.navigate', { url: 'http://localhost:3002/crm' });
  await new Promise(r => setTimeout(r, 2500));
  screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(baseDir, 'crm_mobile.png'), Buffer.from(screenshot.data, 'base64'));
  console.log('Saved crm_mobile.png');

  ws.close();
  proc.kill();
}

capture().catch(console.error);
