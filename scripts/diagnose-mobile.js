const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank'
  ]);

  // Wait for CDP to be ready
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
    console.error('Could not connect to Edge CDP');
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

  console.log('Connected to CDP!');

  // Enable Page & Runtime
  await send('Page.enable');
  await send('Runtime.enable');

  // Emulate mobile device: 390x844
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });

  // Navigate
  await send('Page.navigate', { url: 'http://localhost:3002/' });

  // Wait 3 seconds for hydration and images
  await new Promise(r => setTimeout(r, 3000));

  // Diagnose overflowing elements
  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const vw = window.innerWidth;
        const all = Array.from(document.querySelectorAll('*'));
        const overflowing = [];
        
        all.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 1 || el.scrollWidth > vw + 1) {
            overflowing.push({
              tag: el.tagName,
              className: (el.className || '').toString().slice(0, 80),
              width: Math.round(rect.width),
              right: Math.round(rect.right),
              scrollWidth: el.scrollWidth,
              text: (el.innerText || '').slice(0, 40).replace(/\\n/g, ' ')
            });
          }
        });
        
        return {
          windowInnerWidth: vw,
          documentScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          overflowCount: overflowing.length,
          topOverflowing: overflowing.slice(0, 15)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Diagnosis Result:', JSON.stringify(evalResult.result.value, null, 2));

  // 1. Initial mobile viewport
  let screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const baseDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d02ca969-bf82-484f-9595-f6790db8ef7f\\screenshots';
  fs.writeFileSync(path.join(baseDir, 'mobile_home.png'), Buffer.from(screenshot.data, 'base64'));

  // 2. Open Mobile Menu Drawer
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[aria-label="Toggle menu"]');
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));
  screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(baseDir, 'mobile_menu_open.png'), Buffer.from(screenshot.data, 'base64'));

  // Close menu drawer
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('button[aria-label="Toggle menu"]');
        if (btn) btn.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. Scroll to Learn While You Work & Terminal (scroll 800px)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 800, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 800));
  screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(baseDir, 'mobile_scroll_terminal.png'), Buffer.from(screenshot.data, 'base64'));

  // 4. Scroll to Schools & Programs (scroll 1800px)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 1800, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 800));
  screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(baseDir, 'mobile_scroll_programs.png'), Buffer.from(screenshot.data, 'base64'));

  // 5. Scroll to Projects & Labs (scroll 3200px)
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 3200, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 800));
  screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(baseDir, 'mobile_scroll_projects.png'), Buffer.from(screenshot.data, 'base64'));

  // 6. Switch to Desktop: 1280x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 0, behavior: 'instant' });` });
  await new Promise(r => setTimeout(r, 1200));
  screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(baseDir, 'desktop_home.png'), Buffer.from(screenshot.data, 'base64'));

  console.log('All screenshots captured successfully!');

  ws.close();
  proc.kill();
}

run().catch(console.error);
