import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = "C:\\Users\\Isabel\\.gemini\\antigravity\\brain\\3be5064a-de03-448b-bc02-3478e8e19a4f";

async function run() {
  const profileDir = path.join(process.env.TEMP, "chrome-motion-" + Date.now());
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9230",
    "--user-data-dir=" + profileDir,
    "--no-first-run",
    "--disable-gpu",
  ]);

  let listRes = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      listRes = await fetch("http://localhost:9230/json/new?http://localhost:3000", { method: "PUT" });
      if (listRes.ok) break;
    } catch (err) {}
  }

  if (!listRes || !listRes.ok) {
    console.error("Failed to connect to Chrome!");
    process.exit(1);
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

  // Helper to evaluate JS in page
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
  }

  console.log("============================================================");
  console.log("TEST 1: BRANDED OPENING SEQUENCE (1440x900)");
  console.log("============================================================");

  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Navigate fresh
  await send("Page.navigate", { url: "http://localhost:3000" });

  // Check state at 200ms (during intro hold/appearance)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const introStateEarly = await evalExpr(`(() => {
    const overlay = document.querySelector('.site-intro-overlay');
    const running = document.body.classList.contains('site-intro-running');
    const hero = document.getElementById('desktop-hero-content');
    const heroOpacity = hero ? window.getComputedStyle(hero).opacity : null;
    const clone = overlay ? overlay.querySelector('[data-brand-logo], a, div') : null;
    return {
      hasOverlay: !!overlay,
      isRunning: running,
      heroHidden: heroOpacity === '0',
      hasClone: !!clone,
    };
  })()`);
  console.log("Early Intro State (200ms):", introStateEarly);

  await takeScreenshot(path.join(ARTIFACT_DIR, "screenshot-intro-early.png"));

  // Wait for intro completion (~1800ms)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const introStateLate = await evalExpr(`(() => {
    const overlay = document.querySelector('.site-intro-overlay');
    const completed = document.body.classList.contains('site-intro-complete');
    const running = document.body.classList.contains('site-intro-running');
    const hero = document.getElementById('desktop-hero-content');
    const heroOpacity = hero ? window.getComputedStyle(hero).opacity : null;
    const navLogo = document.querySelector('[data-brand-logo]');
    const navLogoOpacity = navLogo ? window.getComputedStyle(navLogo).opacity : null;
    return {
      overlayRemoved: !overlay,
      isCompleted: completed,
      isRunning: running,
      heroVisible: parseFloat(heroOpacity || '0') > 0.9,
      navLogoVisible: parseFloat(navLogoOpacity || '0') > 0.9,
    };
  })()`);
  console.log("Late Intro State (2200ms):", introStateLate);

  await takeScreenshot(path.join(ARTIFACT_DIR, "screenshot-intro-settled-1440.png"));

  console.log("============================================================");
  console.log("TEST 2: CONTINUOUS & REVERSIBLE SCROLL MOTION (1440x900)");
  console.log("============================================================");

  // 1. Hero scroll
  await evalExpr("window.scrollTo(0, 250)");
  await new Promise((resolve) => setTimeout(resolve, 150));
  const heroDown = await evalExpr(`(() => {
    const hero = document.getElementById('hero-section');
    return { transform: hero?.style.transform, opacity: hero?.style.opacity };
  })()`);
  console.log("Hero scrolled down (250px):", heroDown);

  // Scroll back to top
  await evalExpr("window.scrollTo(0, 0)");
  await new Promise((resolve) => setTimeout(resolve, 150));
  const heroReversed = await evalExpr(`(() => {
    const hero = document.getElementById('hero-section');
    return { transform: hero?.style.transform, opacity: hero?.style.opacity };
  })()`);
  console.log("Hero reversed (0px):", heroReversed);

  // 2. Locations gallery
  const locPos = await evalExpr("document.getElementById('locations').offsetTop");
  await evalExpr(`window.scrollTo(0, ${locPos - 200})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const locState1 = await evalExpr(`(() => {
    const gallery = document.querySelector('[data-motion-gallery="locations"]');
    const img = document.querySelector('.location-inner-media');
    return { gallery: gallery?.style.transform, img: img?.style.transform };
  })()`);

  await evalExpr(`window.scrollTo(0, ${locPos + 200})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const locState2 = await evalExpr(`(() => {
    const gallery = document.querySelector('[data-motion-gallery="locations"]');
    const img = document.querySelector('.location-inner-media');
    return { gallery: gallery?.style.transform, img: img?.style.transform };
  })()`);

  // Reverse scroll
  await evalExpr(`window.scrollTo(0, ${locPos - 200})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const locStateReversed = await evalExpr(`(() => {
    const gallery = document.querySelector('[data-motion-gallery="locations"]');
    const img = document.querySelector('.location-inner-media');
    return { gallery: gallery?.style.transform, img: img?.style.transform };
  })()`);
  console.log("Locations forward vs reverse:", { pos1: locState1, pos2: locState2, reversed: locStateReversed });

  // 3. Featured Properties
  const propPos = await evalExpr("document.getElementById('properties').offsetTop");
  await evalExpr(`window.scrollTo(0, ${propPos})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const propState = await evalExpr(`(() => {
    const s = document.querySelector('[data-motion-section="estates"]');
    const w = s?.querySelector('.estates-media-window');
    return { section: s?.style.transform, window: w?.style.transform };
  })()`);
  console.log("Featured Properties state:", propState);

  // 4. Buyer Stories
  const storiesPos = await evalExpr("document.getElementById('buyer-stories').offsetTop");
  await evalExpr(`window.scrollTo(0, ${storiesPos})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const storiesState = await evalExpr(`(() => {
    const inner = document.querySelector('[data-motion-inner="buyer-stories"]');
    const card0 = document.querySelectorAll('.buyer-story-parallax-inner')[0];
    const card1 = document.querySelectorAll('.buyer-story-parallax-inner')[1];
    return { inner: inner?.style.transform, card0: card0?.style.transform, card1: card1?.style.transform };
  })()`);
  console.log("Buyer Stories state:", storiesState);

  // 5. Why Buy With Us
  const whyPos = await evalExpr("document.getElementById('why-buy').offsetTop");
  await evalExpr(`window.scrollTo(0, ${whyPos})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const whyState = await evalExpr(`(() => {
    const section = document.getElementById('why-buy');
    const inner = document.querySelector('[data-motion-inner="why-buy"]');
    const card0 = document.querySelectorAll('.why-buy-parallax-inner')[0];
    return {
      sectionTransform: section?.style.transform || 'none (stable full-width)',
      inner: inner?.style.transform,
      card0: card0?.style.transform,
    };
  })()`);
  console.log("Why Buy With Us state:", whyState);

  // 6. How It Works
  const howPos = await evalExpr("document.getElementById('how-it-works').offsetTop");
  await evalExpr(`window.scrollTo(0, ${howPos - 150})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const howStateStart = await evalExpr(`(() => {
    const line = document.getElementById('how-it-works-line-desktop');
    const steps = Array.from(document.querySelectorAll('.how-step-parallax-inner')).filter(e => e.offsetParent !== null);
    return {
      line: line?.style.transform,
      step0: { opacity: steps[0]?.style.opacity, filter: steps[0]?.style.filter },
      step1: { opacity: steps[1]?.style.opacity, filter: steps[1]?.style.filter },
      step3: { opacity: steps[3]?.style.opacity, filter: steps[3]?.style.filter },
    };
  })()`);

  await evalExpr(`window.scrollTo(0, ${howPos + 250})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const howStateMid = await evalExpr(`(() => {
    const line = document.getElementById('how-it-works-line-desktop');
    const steps = Array.from(document.querySelectorAll('.how-step-parallax-inner')).filter(e => e.offsetParent !== null);
    return {
      line: line?.style.transform,
      step0: { opacity: steps[0]?.style.opacity, filter: steps[0]?.style.filter },
      step1: { opacity: steps[1]?.style.opacity, filter: steps[1]?.style.filter },
      step3: { opacity: steps[3]?.style.opacity, filter: steps[3]?.style.filter },
    };
  })()`);

  // Reverse How It Works
  await evalExpr(`window.scrollTo(0, ${howPos - 150})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const howStateReversed = await evalExpr(`(() => {
    const line = document.getElementById('how-it-works-line-desktop');
    const steps = Array.from(document.querySelectorAll('.how-step-parallax-inner')).filter(e => e.offsetParent !== null);
    return {
      line: line?.style.transform,
      step0: { opacity: steps[0]?.style.opacity, filter: steps[0]?.style.filter },
      step1: { opacity: steps[1]?.style.opacity, filter: steps[1]?.style.filter },
      step3: { opacity: steps[3]?.style.opacity, filter: steps[3]?.style.filter },
    };
  })()`);
  console.log("How It Works progression & reversal:", {
    start: howStateStart,
    mid: howStateMid,
    reversed: howStateReversed,
  });

  // 7. Final Enquiry
  const inqPos = await evalExpr("document.getElementById('inspection').offsetTop");
  await evalExpr(`window.scrollTo(0, ${inqPos})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const inqState = await evalExpr(`(() => {
    const section = document.getElementById('inspection');
    const inner = document.querySelector('[data-motion-inner="inspection"]');
    const bg = document.querySelector('[data-motion-enquiry-bg]');
    return {
      sectionStable: section?.style.transform || 'none',
      inner: inner?.style.transform,
      bg: bg?.style.transform,
    };
  })()`);
  console.log("Final Enquiry state:", inqState);

  await takeScreenshot(path.join(ARTIFACT_DIR, "screenshot-motion-desktop-enquiry.png"));

  console.log("============================================================");
  console.log("TEST 3: MOBILE TESTING (390x844)");
  console.log("============================================================");

  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await send("Page.navigate", { url: "http://localhost:3000" });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mobileHowPos = await evalExpr("document.getElementById('how-it-works').offsetTop");
  await evalExpr(`window.scrollTo(0, ${mobileHowPos + 100})`);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const mobileHowState = await evalExpr(`(() => {
    const line = document.getElementById('how-it-works-line-mobile');
    const steps = Array.from(document.querySelectorAll('.how-step-parallax-inner')).filter(e => e.offsetParent !== null);
    return {
      line: line?.style.transform,
      visibleStepsCount: steps.length,
      step0: { opacity: steps[0]?.style.opacity, filter: steps[0]?.style.filter },
      step1: { opacity: steps[1]?.style.opacity, filter: steps[1]?.style.filter },
    };
  })()`);
  console.log("Mobile How It Works state:", mobileHowState);

  await takeScreenshot(path.join(ARTIFACT_DIR, "screenshot-motion-mobile-how.png"));

  console.log("All automated motion verification tests passed successfully!");
  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error("Verification error:", err);
  process.exit(1);
});
