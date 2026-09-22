import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\Isabel\\.gemini\\antigravity\\brain\\3be5064a-de03-448b-bc02-3478e8e19a4f';

async function run() {
  const profileDir = path.join(process.env.TEMP, 'chrome-wb-' + Date.now());
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--user-data-dir=' + profileDir,
    '--no-first-run',
    '--disable-gpu',
  ]);

  let listRes = null;
  for (let i = 0; i < 15; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      listRes = await fetch('http://localhost:9226/json/new?http://localhost:3000', { method: 'PUT' });
      if (listRes.ok) break;
    } catch (err) {}
  }
  const target = await listRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => { ws.onopen = resolve; });

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  const viewports = [
    { width: 1440, height: 900, name: 'desktop-1440x900', isMobile: false },
    { width: 1366, height: 768, name: 'desktop-1366x768', isMobile: false },
    { width: 430, height: 932, name: 'mobile-430x932', isMobile: true },
    { width: 390, height: 844, name: 'mobile-390x844', isMobile: true },
    { width: 375, height: 812, name: 'mobile-375x812', isMobile: true }
  ];

  for (const vp of viewports) {
    console.log('------------------------------------------------------------');
    console.log('TESTING VIEWPORT: ' + vp.name);
    console.log('------------------------------------------------------------');

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.isMobile
    });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const evaluation = await send('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const overflow = docEl.scrollWidth - window.innerWidth;

        // 1. Header CTA
        const headerCta = Array.from(document.querySelectorAll('header button'))
          .map(el => el.textContent.trim())
          .filter(t => t.includes('Talk to an Advisor'));

        // 2. Locations CTA
        const locationCtas = Array.from(document.querySelectorAll('#locations a, #locations button'))
          .map(el => el.textContent.trim())
          .filter(t => t.includes('Explore Location'));

        // 3. Properties Carousel CTA
        const propCtas = Array.from(document.querySelectorAll('#properties .estates-media-img ~ * a, #properties a, #properties button'))
          .map(el => el.textContent.trim())
          .filter(t => t === 'View Properties');

        // 4. Why Buy With Us "Get Benefit" CTAs
        const whyBuyCtas = Array.from(document.querySelectorAll('#why-buy a, #why-buy button'))
          .map(el => el.textContent.trim())
          .filter(t => t.includes('Get Benefit'));

        // 5. Final bottom CTAs
        const bottomCtas = Array.from(document.querySelectorAll('#inspection a, #inspection button'))
          .map(el => el.textContent.trim())
          .filter(t => t.includes('View Properties') || t.includes('Talk to an Advisor'));

        return {
          overflow,
          headerCta,
          locationCtas,
          propCtas,
          whyBuyCtas,
          bottomCtas
        };
      })()`,
      returnByValue: true
    });

    console.log('Result:', JSON.stringify(evaluation.result.value, null, 2));

    if (vp.name === 'desktop-1440x900') {
      // 1. Top of page / header
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
      await new Promise((r) => setTimeout(r, 600));
      const topSnap = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot-header-top.png'), Buffer.from(topSnap.data, 'base64'));

      // 2. Featured Properties Carousel (with subtle glow)
      await send('Runtime.evaluate', {
        expression: `document.getElementById('properties')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
      });
      await new Promise((r) => setTimeout(r, 700));
      const propSnap = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot-properties-glow.png'), Buffer.from(propSnap.data, 'base64'));

      // 3. Why Buy With Us (Get Benefit CTAs)
      await send('Runtime.evaluate', {
        expression: `document.getElementById('why-buy')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
      });
      await new Promise((r) => setTimeout(r, 700));
      const wbSnap = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot-why-buy-get-benefit.png'), Buffer.from(wbSnap.data, 'base64'));

      // 4. Final Enquiry (View Properties + Talk to an Advisor CTAs)
      await send('Runtime.evaluate', {
        expression: `document.getElementById('inspection')?.scrollIntoView({ behavior: 'instant', block: 'center' });`
      });
      await new Promise((r) => setTimeout(r, 700));
      const enqSnap = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'screenshot-final-ctas.png'), Buffer.from(enqSnap.data, 'base64'));
    }
  }

  ws.close();
  chrome.kill('SIGTERM');
}

run();