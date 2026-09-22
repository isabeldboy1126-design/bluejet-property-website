import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\Isabel\\.gemini\\antigravity\\brain\\3be5064a-de03-448b-bc02-3478e8e19a4f';

async function run() {
  const profileDir = path.join(process.env.TEMP, 'chrome-fold-test-' + Date.now());
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + profileDir,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
  ]);

  let listRes = null;
  for (let i = 0; i < 15; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      listRes = await fetch('http://localhost:9222/json/new?http://localhost:3000', { method: 'PUT' });
      if (listRes.ok) break;
    } catch (err) {}
  }
  if (!listRes || !listRes.ok) throw new Error('Could not connect to Chrome on port 9222');
  const target = await listRes.json();
  const wsUrl = target.webSocketDebuggerUrl;

  try {
    const ws = new WebSocket(wsUrl);
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
      { width: 1440, height: 900, name: 'about-1440x900', isMobile: false },
      { width: 1366, height: 768, name: 'about-1366x768', isMobile: false },
      { width: 430, height: 932, name: 'about-430x932', isMobile: true },
      { width: 390, height: 844, name: 'about-390x844', isMobile: true },
      { width: 375, height: 812, name: 'about-375x812', isMobile: true }
    ];

    for (const vp of viewports) {
      console.log('\n=== TESTING VIEWPORT: ' + vp.name + ' (' + vp.width + ' x ' + vp.height + ') ===');
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile
      });
      await send('Page.navigate', { url: 'http://localhost:3000' });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Scroll to about section to trigger reveal
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById('about');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        `
      });

      // Wait 1.6s for entrance animation sequence to fully assemble
      await new Promise((resolve) => setTimeout(resolve, 1600));

      function evaluateAboutInBrowser() {
        try {
          const section = document.getElementById('about');
          const outer = section ? section.querySelector('.about-outer-container') : null;
          const isRevealed = section ? section.classList.contains('about-is-revealed') : false;
          const imgA = section ? section.querySelector('.about-anim-img-a') : null;
          const imgB = section ? section.querySelector('.about-anim-img-b') : null;
          const metric = section ? section.querySelector('.about-anim-metric') : null;
          const eyebrow = section ? section.querySelector('.about-anim-eyebrow') : null;
          const headline = section ? section.querySelector('.about-anim-headline') : null;
          const body = section ? section.querySelector('.about-anim-body') : null;
          const proofRows = section ? section.querySelectorAll('.about-proof-row') : [];
          const cta = section ? section.querySelector('.about-anim-cta') : null;

          function getBox(el) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
              height: Math.round(r.height),
              text: (el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 45)
            };
          }

          const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

          return {
            windowInnerWidth: window.innerWidth,
            windowInnerHeight: window.innerHeight,
            isRevealed,
            hasOverflow,
            scrollWidth: document.documentElement.scrollWidth,
            outerBox: getBox(outer),
            imgABox: getBox(imgA),
            imgBBox: getBox(imgB),
            metricBox: getBox(metric),
            eyebrowBox: getBox(eyebrow),
            headlineBox: getBox(headline),
            bodyBox: getBox(body),
            proofCount: proofRows.length,
            proofRows: Array.from(proofRows).map(getBox),
            ctaBox: getBox(cta)
          };
        } catch (e) {
          return { error: e.message, stack: e.stack };
        }
      }

      const evalRes = await send('Runtime.evaluate', {
        expression: '(' + evaluateAboutInBrowser.toString() + ')()',
        returnByValue: true
      });

      const data = evalRes.result.value;
      if (!data || data.error) {
        console.error('Eval error:', data);
        continue;
      }

      console.log('✓ Revealed class present?', data.isRevealed ? 'YES ✅' : 'NO ❌');
      console.log('✓ Horizontal overflow?', data.hasOverflow ? 'FAIL ❌ (Overflow detected)' : 'PASS ✅ (No horizontal overflow)');
      console.log('✓ Outer container box:', data.outerBox);
      console.log('✓ Image A box:', data.imgABox);
      console.log('✓ Image B box:', data.imgBBox);
      console.log('✓ Metric Tile box:', data.metricBox);
      console.log('✓ Proof rows count:', data.proofCount);
      console.log('✓ CTA box:', data.ctaBox);

      // Verify overlap: Image B right > Image A left, Image B top < Image A bottom
      if (data.imgABox && data.imgBBox) {
        const xOverlap = data.imgBBox.right > data.imgABox.left;
        const yOverlap = data.imgBBox.top < data.imgABox.bottom;
        console.log('✓ Image A & Image B overlap?', (xOverlap && yOverlap) ? 'YES ✅ (Asymmetrical overlap verified)' : 'NO ❌');
      }

      if (data.imgABox && data.metricBox) {
        const metricXOverlap = data.metricBox.left < data.imgABox.right && data.metricBox.right > data.imgABox.left;
        const metricYOverlap = data.metricBox.top < data.imgABox.bottom;
        console.log('✓ Metric Tile overlaps Image A?', (metricXOverlap && metricYOverlap) ? 'YES ✅ (Layered overlap verified)' : 'CHECK');
      }

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const shotPath = path.join(ARTIFACT_DIR, 'screenshot-' + vp.name + '.png');
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot to: ' + shotPath);
    }

    ws.close();
  } catch (e) {
    console.error('Test error:', e);
  } finally {
    chrome.kill();
  }
}

run();
