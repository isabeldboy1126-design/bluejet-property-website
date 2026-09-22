import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = 'C:\\Users\\Isabel\\.gemini\\antigravity\\brain\\3be5064a-de03-448b-bc02-3478e8e19a4f';

async function run() {
  const profileDir = path.join(process.env.TEMP, 'chrome-stories-test-' + Date.now());
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--user-data-dir=' + profileDir,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
  ]);

  let listRes = null;
  for (let i = 0; i < 15; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      listRes = await fetch('http://localhost:9223/json/new?http://localhost:3000', { method: 'PUT' });
      if (listRes.ok) break;
    } catch (err) {}
  }
  if (!listRes || !listRes.ok) throw new Error('Could not connect to Chrome on port 9223');
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
      { width: 1440, height: 900, name: 'desktop-1440x900', isMobile: false },
      { width: 1366, height: 768, name: 'desktop-1366x768', isMobile: false },
      { width: 430, height: 932, name: 'mobile-430x932', isMobile: true },
      { width: 390, height: 844, name: 'mobile-390x844', isMobile: true },
      { width: 375, height: 812, name: 'mobile-375x812', isMobile: true }
    ];

    for (const vp of viewports) {
      console.log('\n============================================================');
      console.log('TESTING VIEWPORT: ' + vp.name + ' (' + vp.width + ' x ' + vp.height + ')');
      console.log('============================================================');

      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile
      });
      await send('Page.navigate', { url: 'http://localhost:3000' });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Scroll sequentially down the page to trigger each section observer
      await send('Runtime.evaluate', {
        expression: `
          (async () => {
            const sections = [
              'hero-section',
              'about',
              'locations',
              'estates',
              'buyer-stories',
              'why-buy',
              'clarity',
              'how-it-works',
              'inspection'
            ];
            for (const s of sections) {
              const el = document.getElementById(s) || document.querySelector('[data-motion-section=\"' + s + '\"]');
              if (el) {
                el.scrollIntoView({ behavior: 'instant', block: 'center' });
                await new Promise(r => setTimeout(r, 120));
              }
            }
          })();
        `,
        awaitPromise: true
      });

      // Now scroll specifically to buyer-stories for snapshot
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById('buyer-stories');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        `
      });

      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Inspection logic in browser
      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            // Check Section Order
            const expectedOrder = [
              'hero-section',
              'about',
              'locations',
              'estates',
              'buyer-stories',
              'why-buy',
              'clarity',
              'how-it-works',
              'inspection'
            ];

            const foundOrder = [];
            const allElements = document.querySelectorAll('section, [data-motion-section]');
            allElements.forEach(el => {
              const id = el.id || el.getAttribute('data-motion-section');
              if (id && expectedOrder.includes(id) && !foundOrder.includes(id)) {
                foundOrder.push(id);
              }
            });

            // Inspect Buyer Stories Section
            const storiesSection = document.getElementById('buyer-stories');
            const hasSection = !!storiesSection;
            const isRevealed = storiesSection ? storiesSection.classList.contains('buyer-stories-revealed') : false;

            // Cards
            const desktopCards = storiesSection ? storiesSection.querySelectorAll('.buyer-story-card') : [];
            const mobileCards = storiesSection ? storiesSection.querySelectorAll('.buyer-story-mobile-card') : [];

            // Rating Stars
            const starSVGs = storiesSection ? storiesSection.querySelectorAll('svg.lucide-star') : [];

            // CTA Button
            const ctaBtn = storiesSection ? Array.from(storiesSection.querySelectorAll('button')).find(b => b.innerText.includes('Get Similar Results')) : null;

            // Horizontal Overflow
            const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

            // Motion classes check
            const motionStatus = {
              locationsRevealed: document.querySelector('.locations-revealed') !== null,
              estatesRevealed: document.querySelector('.estates-revealed') !== null,
              storiesRevealed: isRevealed,
              whyBuyRevealed: document.querySelector('.why-buy-revealed') !== null,
              clarityRevealed: document.querySelector('.clarity-revealed') !== null,
              howItWorksRevealed: document.querySelector('.how-it-works-revealed') !== null,
              enquiryConvergeActive: document.querySelector('.enquiry-converge-active') !== null,
            };

            return {
              hasOverflow,
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
              foundOrder,
              expectedOrderMatch: JSON.stringify(foundOrder) === JSON.stringify(expectedOrder),
              buyerStories: {
                hasSection,
                isRevealed,
                desktopCardsCount: desktopCards.length,
                mobileCardsCount: mobileCards.length,
                starCount: starSVGs.length,
                hasCtaButton: !!ctaBtn
              },
              motionStatus
            };
          })()
        `,
        returnByValue: true
      });

      const data = evalRes.result.value;
      console.log('Section Order Match:', data.expectedOrderMatch ? '✅ EXACT' : '❌ MISMATCH');
      console.log('Found Sequence:', data.foundOrder.join(' -> '));
      console.log('Horizontal Overflow:', data.hasOverflow ? `❌ LEAK (${data.scrollWidth}px > ${data.innerWidth}px)` : '✅ ZERO');
      console.log('Buyer Stories Revealed:', data.buyerStories.isRevealed ? '✅ YES' : '❌ NO');
      console.log('Desktop Cards Count:', data.buyerStories.desktopCardsCount);
      console.log('Mobile Cards Count:', data.buyerStories.mobileCardsCount);
      console.log('Stars Rendered:', data.buyerStories.starCount);
      console.log('Get Similar Results CTA:', data.buyerStories.hasCtaButton ? '✅ PRESENT' : '❌ MISSING');
      console.log('Motion System Active States:', JSON.stringify(data.motionStatus, null, 2));

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });
      const shotPath = path.join(ARTIFACT_DIR, `screenshot-stories-${vp.name}.png`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log('Saved Screenshot to:', shotPath);
    }

    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

run().catch(err => {
  console.error('Verification script error:', err);
  process.exit(1);
});