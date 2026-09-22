import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\Isabel\\.gemini\\antigravity\\brain\\3be5064a-de03-448b-bc02-3478e8e19a4f';

async function run() {
  const profileDir = path.join(process.env.TEMP, 'chrome-mobile-test-' + Date.now());
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--user-data-dir=' + profileDir,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
  ]);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const listRes = await fetch('http://localhost:9223/json/new?http://localhost:3000', { method: 'PUT' });
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
      { width: 390, height: 844, name: '390x844' },
      { width: 375, height: 812, name: '375x812' },
      { width: 430, height: 932, name: '430x932' }
    ];

    for (const vp of viewports) {
      console.log('\n=== TESTING MOBILE VIEWPORT: ' + vp.name + ' (' + vp.width + ' x ' + vp.height + ') ===');
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Page.navigate', { url: 'http://localhost:3000' });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      function evaluateMobileDOM() {
        try {
          const mobileView = document.getElementById('mobile-hero-content');
          if (!mobileView) return { error: 'mobileView (#mobile-hero-content) not found' };

          const eyebrow = mobileView.querySelector('.hero-anim-eyebrow');
          const headline = mobileView.querySelector('h1');
          const subheadline = mobileView.querySelector('p');
          const ctas = mobileView.querySelector('.hero-anim-ctas');
          const friction = mobileView.querySelector('.hero-anim-friction');
          const divider = mobileView.querySelector('.hero-anim-divider');
          const metricsGrid = mobileView.querySelector('.grid.grid-cols-3');
          const metrics = metricsGrid ? metricsGrid.querySelectorAll(':scope > div') : [];
          const imageWrap = mobileView.querySelector('img');

          function getBox(el) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height), text: (el.innerText || '').trim().slice(0, 45) };
          }

          return {
            eyebrow: getBox(eyebrow),
            headline: getBox(headline),
            subheadline: getBox(subheadline),
            ctas: getBox(ctas),
            friction: getBox(friction),
            divider: getBox(divider),
            metricsCount: metrics.length,
            metrics: Array.from(metrics).map(getBox),
            image: getBox(imageWrap),
          };
        } catch (e) {
          return { error: e.message };
        }
      }

      const evalRes = await send('Runtime.evaluate', {
        expression: '(' + evaluateMobileDOM.toString() + ')()',
        returnByValue: true
      });

      const data = evalRes.result.value;
      console.log('Mobile DOM Analysis:', JSON.stringify(data, null, 2));

      // Check vertical order
      if (data && !data.error) {
        const orderValid =
          data.eyebrow.top < data.headline.top &&
          data.headline.top < data.subheadline.top &&
          data.subheadline.top < data.ctas.top &&
          data.ctas.top < data.friction.top &&
          data.friction.top < data.divider.top &&
          data.divider.top < data.metrics[0].top &&
          data.metrics[0].bottom <= data.image.top;

        console.log('Mobile Vertical Sequence Order Valid:', orderValid ? 'YES ✅' : 'NO ❌');
        console.log('Mobile Metrics Count:', data.metricsCount, data.metricsCount === 3 ? '(EXACTLY 3 ✅)' : '(FAIL ❌)');
      }

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const shotPath = path.join(ARTIFACT_DIR, 'screenshot-mobile-' + vp.name + '.png');
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log('Saved mobile screenshot to: ' + shotPath);
    }

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    chrome.kill();
  }
}
run();
