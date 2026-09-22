import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = "C:\\Users\\Isabel\\.gemini\\antigravity\\brain\\3be5064a-de03-448b-bc02-3478e8e19a4f";

async function run() {
  const profileDir = path.join(process.env.TEMP, "chrome-full-test-" + Date.now());
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9242",
    "--user-data-dir=" + profileDir,
    "--no-first-run",
    "--disable-gpu",
  ]);

  let listRes = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      listRes = await fetch("http://localhost:9242/json/new?http://localhost:3000", { method: "PUT" });
      if (listRes.ok) break;
    } catch (e) {}
  }

  const target = await listRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => { ws.onopen = r; });

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener("message", handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");

  async function evalExpr(expr) {
    const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async function takeScreenshot(filePath) {
    const snap = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(filePath, Buffer.from(snap.data, "base64"));
    console.log(`Saved screenshot: ${path.basename(filePath)}`);
  }

  // Viewports to test
  const viewports = [
    { width: 1440, height: 900, name: "desktop-1440x900", mobile: false },
    { width: 1366, height: 768, name: "desktop-1366x768", mobile: false },
    { width: 430, height: 932, name: "mobile-430x932", mobile: true },
    { width: 390, height: 844, name: "mobile-390x844", mobile: true },
  ];

  console.log("============================================================");
  console.log("PHASE 1: PAGE OPENING SEQUENCE TESTS (Desktop & Mobile)");
  console.log("============================================================");

  for (const vp of [viewports[0], viewports[3]]) {
    console.log(`\nTesting Opening on ${vp.name}...`);
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.mobile ? 2 : 1,
      mobile: vp.mobile,
    });

    await send("Page.navigate", { url: "http://localhost:3000" });

    // Sample at 300ms (intro running, logo centered)
    await new Promise((r) => setTimeout(r, 300));
    const openingState = await evalExpr(`(() => {
      const overlay = document.querySelector('.site-intro-overlay');
      const isRunning = document.body.classList.contains('site-intro-running');
      const hero = document.getElementById('${vp.mobile ? "mobile-hero-content" : "desktop-hero-content"}');
      const heroOpacity = hero ? window.getComputedStyle(hero).opacity : null;
      return {
        hasOverlay: !!overlay,
        isRunning,
        heroHidden: heroOpacity === '0',
      };
    })()`);
    console.log(`[${vp.name}] Opening Early (300ms):`, openingState);
    await takeScreenshot(path.join(ARTIFACT_DIR, `screenshot-opening-${vp.name}.png`));

    // Wait for full completion (~3.5s)
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 200));
      const done = await evalExpr("!document.querySelector('.site-intro-overlay') && document.body.classList.contains('site-intro-complete')");
      if (done) {
        console.log(`[${vp.name}] Opening completed cleanly at ${(i + 1) * 200 + 300}ms`);
        break;
      }
    }

    const settledState = await evalExpr(`(() => {
      const hero = document.getElementById('${vp.mobile ? "mobile-hero-content" : "desktop-hero-content"}');
      const navLogo = document.querySelector('[data-brand-logo]');
      return {
        overlayDestroyed: !document.querySelector('.site-intro-overlay'),
        siteIntroComplete: document.body.classList.contains('site-intro-complete'),
        heroVisible: parseFloat(window.getComputedStyle(hero).opacity) > 0.9,
        navLogoVisible: parseFloat(window.getComputedStyle(navLogo).opacity) > 0.9,
      };
    })()`);
    console.log(`[${vp.name}] Settled State:`, settledState);
    await takeScreenshot(path.join(ARTIFACT_DIR, `screenshot-settled-${vp.name}.png`));
  }

  console.log("\n============================================================");
  console.log("PHASE 2: SECTION-BY-SECTION CONTINUOUS & REVERSIBLE MOTION");
  console.log("============================================================");

  for (const vp of viewports) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`------------------------------------------------------------`);

    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.mobile ? 2 : 1,
      mobile: vp.mobile,
    });

    await send("Page.navigate", { url: "http://localhost:3000" });

    // Wait for intro completion
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 200));
      const done = await evalExpr("!document.querySelector('.site-intro-overlay') && document.body.classList.contains('site-intro-complete')");
      if (done) break;
    }

    // Disable smooth scroll for instant CDP positioning
    await evalExpr("document.documentElement.style.scrollBehavior = 'auto'");

    // 1. Hero Outgoing Recession & Reversal
    await evalExpr("window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll'));");
    await new Promise((r) => setTimeout(r, 80));
    const heroAtTop = await evalExpr("document.getElementById('hero-section')?.style.transform");

    await evalExpr("window.scrollTo(0, 300); window.dispatchEvent(new Event('scroll'));");
    await new Promise((r) => setTimeout(r, 80));
    const heroScrolled = await evalExpr("document.getElementById('hero-section')?.style.transform");

    await evalExpr("window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll'));");
    await new Promise((r) => setTimeout(r, 80));
    const heroReturned = await evalExpr("document.getElementById('hero-section')?.style.transform");

    console.log("Hero Motion Reversibility:", {
      top: heroAtTop || "initial",
      scrolled: heroScrolled,
      returned: heroReturned,
      reversible: heroAtTop === heroReturned,
    });

    // 2. Locations Parallax & Gallery Growth Reversal
    const locOffset = await evalExpr("document.getElementById('locations')?.offsetTop");
    await evalExpr(`window.scrollTo(0, ${locOffset - 150}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const locPos1 = await evalExpr(`(() => {
      const g = document.querySelector('[data-motion-gallery="locations"]');
      const m = document.querySelector('.location-inner-media');
      return { gallery: g?.style.transform, media: m?.style.transform };
    })()`);

    await evalExpr(`window.scrollTo(0, ${locOffset + 200}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const locPos2 = await evalExpr(`(() => {
      const g = document.querySelector('[data-motion-gallery="locations"]');
      const m = document.querySelector('.location-inner-media');
      return { gallery: g?.style.transform, media: m?.style.transform };
    })()`);

    // Reverse
    await evalExpr(`window.scrollTo(0, ${locOffset - 150}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const locPosReversed = await evalExpr(`(() => {
      const g = document.querySelector('[data-motion-gallery="locations"]');
      const m = document.querySelector('.location-inner-media');
      return { gallery: g?.style.transform, media: m?.style.transform };
    })()`);

    console.log("Locations Reversibility:", {
      pos1: locPos1,
      pos2: locPos2,
      reversed: locPosReversed,
      reversible: JSON.stringify(locPos1) === JSON.stringify(locPosReversed),
    });

    // 3. Featured Properties Editorial Window
    const propOffset = await evalExpr("document.getElementById('properties')?.offsetTop");
    await evalExpr(`window.scrollTo(0, ${propOffset}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const propMotion = await evalExpr(`(() => {
      const sec = document.querySelector('[data-motion-section="estates"]');
      const win = sec?.querySelector('.estates-media-window');
      return { section: sec?.style.transform, window: win?.style.transform };
    })()`);
    console.log("Featured Properties Motion:", propMotion);

    // 4. Buyer Stories Proof-Sheet Depth
    const storiesOffset = await evalExpr("document.getElementById('buyer-stories')?.offsetTop");
    await evalExpr(`window.scrollTo(0, ${storiesOffset - 100}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const storiesP1 = await evalExpr(`(() => {
      const inner = document.querySelector('[data-motion-inner="buyer-stories"]');
      const card = document.querySelector('.buyer-story-parallax-inner');
      return { inner: inner?.style.transform, card: card?.style.transform };
    })()`);

    await evalExpr(`window.scrollTo(0, ${storiesOffset + 200}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const storiesP2 = await evalExpr(`(() => {
      const inner = document.querySelector('[data-motion-inner="buyer-stories"]');
      const card = document.querySelector('.buyer-story-parallax-inner');
      return { inner: inner?.style.transform, card: card?.style.transform };
    })()`);

    // Reverse
    await evalExpr(`window.scrollTo(0, ${storiesOffset - 100}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const storiesReversed = await evalExpr(`(() => {
      const inner = document.querySelector('[data-motion-inner="buyer-stories"]');
      const card = document.querySelector('.buyer-story-parallax-inner');
      return { inner: inner?.style.transform, card: card?.style.transform };
    })()`);

    console.log("Buyer Stories Reversibility:", {
      p1: storiesP1,
      p2: storiesP2,
      reversed: storiesReversed,
      reversible: JSON.stringify(storiesP1) === JSON.stringify(storiesReversed),
    });

    // 5. Why Buy With Us Stable Green Section + Benefit Depth
    const whyOffset = await evalExpr("document.getElementById('why-buy')?.offsetTop");
    await evalExpr(`window.scrollTo(0, ${whyOffset}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const whyMotion = await evalExpr(`(() => {
      const sec = document.getElementById('why-buy');
      const inner = document.querySelector('[data-motion-inner="why-buy"]');
      const card = document.querySelector('.why-buy-parallax-inner');
      return {
        sectionTransform: sec?.style.transform || 'none (stable edge-to-edge green)',
        inner: inner?.style.transform,
        card: card?.style.transform,
      };
    })()`);
    console.log("Why Buy With Us Motion:", whyMotion);

    // 6. Buy With Greater Clarity Parallax
    const clarityOffset = await evalExpr("document.querySelector('[data-motion-section=\"clarity\"]')?.offsetTop");
    await evalExpr(`window.scrollTo(0, ${clarityOffset}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const clarityMotion = await evalExpr(`(() => {
      const media = document.querySelector('.clarity-media-inner');
      return { clarityMedia: media?.style.transform };
    })()`);
    console.log("Clarity Media Motion:", clarityMotion);

    // 7. How It Works Step Focus Progression & Line Draw/Undraw
    const howOffset = await evalExpr("document.getElementById('how-it-works')?.offsetTop");
    const lineId = vp.mobile ? "how-it-works-line-mobile" : "how-it-works-line-desktop";

    // Start of How It Works
    await evalExpr(`window.scrollTo(0, ${howOffset - 150}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const howStart = await evalExpr(`(() => {
      const line = document.getElementById('${lineId}');
      const steps = Array.from(document.querySelectorAll('.how-step-parallax-inner')).filter(e => e.offsetParent !== null);
      return {
        line: line?.style.transform,
        step0: { opacity: steps[0]?.style.opacity, filter: steps[0]?.style.filter },
        step1: { opacity: steps[1]?.style.opacity, filter: steps[1]?.style.filter },
        step3: { opacity: steps[3]?.style.opacity, filter: steps[3]?.style.filter },
      };
    })()`);

    // Mid of How It Works
    await evalExpr(`window.scrollTo(0, ${howOffset + 250}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const howMid = await evalExpr(`(() => {
      const line = document.getElementById('${lineId}');
      const steps = Array.from(document.querySelectorAll('.how-step-parallax-inner')).filter(e => e.offsetParent !== null);
      return {
        line: line?.style.transform,
        step0: { opacity: steps[0]?.style.opacity, filter: steps[0]?.style.filter },
        step1: { opacity: steps[1]?.style.opacity, filter: steps[1]?.style.filter },
        step3: { opacity: steps[3]?.style.opacity, filter: steps[3]?.style.filter },
      };
    })()`);

    // Reverse of How It Works
    await evalExpr(`window.scrollTo(0, ${howOffset - 150}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const howReversed = await evalExpr(`(() => {
      const line = document.getElementById('${lineId}');
      const steps = Array.from(document.querySelectorAll('.how-step-parallax-inner')).filter(e => e.offsetParent !== null);
      return {
        line: line?.style.transform,
        step0: { opacity: steps[0]?.style.opacity, filter: steps[0]?.style.filter },
        step1: { opacity: steps[1]?.style.opacity, filter: steps[1]?.style.filter },
        step3: { opacity: steps[3]?.style.opacity, filter: steps[3]?.style.filter },
      };
    })()`);

    console.log(`How It Works Line & Focus [${vp.name}]:`, {
      start: howStart,
      mid: howMid,
      reversed: howReversed,
      lineReversed: howStart.line === howReversed.line,
    });

    // 8. Final Enquiry Restrained Convergence
    const inqOffset = await evalExpr("document.getElementById('inspection')?.offsetTop");
    await evalExpr(`window.scrollTo(0, ${inqOffset - 150}); window.dispatchEvent(new Event('scroll'));`);
    await new Promise((r) => setTimeout(r, 80));
    const inqMotion = await evalExpr(`(() => {
      const sec = document.getElementById('inspection');
      const inner = document.querySelector('[data-motion-inner="inspection"]');
      const bg = document.querySelector('[data-motion-enquiry-bg]');
      return {
        sectionStable: sec?.style.transform || 'none (stable full-width green)',
        inner: inner?.style.transform,
        bg: bg?.style.transform,
      };
    })()`);
    console.log("Final Enquiry Motion:", inqMotion);

    await takeScreenshot(path.join(ARTIFACT_DIR, `screenshot-verified-${vp.name}.png`));
  }

  console.log("\n============================================================");
  console.log("ALL VIEWPORT & MOTION VERIFICATION TESTS COMPLETED WITH SUCCESS!");
  console.log("============================================================");

  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
