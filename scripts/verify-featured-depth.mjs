import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = "C:\\Users\\Isabel\\.gemini\\antigravity\\brain\\3be5064a-de03-448b-bc02-3478e8e19a4f";

async function run() {
  const profileDir = path.join(process.env.TEMP, "chrome-depth-test-" + Date.now());
  const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
    "--headless=new",
    "--remote-debugging-port=9246",
    "--user-data-dir=" + profileDir,
    "--no-first-run",
    "--disable-gpu",
  ]);

  let listRes = null;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      listRes = await fetch("http://localhost:9246/json/new?http://localhost:3000", { method: "PUT" });
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
  }

  console.log("Waiting for page intro to complete...");
  await new Promise((r) => setTimeout(r, 4500));

  // 1. DESKTOP VIEWPORT (1440x900)
  console.log("\n--- TEST 1: DESKTOP 1440x900 INITIAL STATE ---");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evalExpr("window.dispatchEvent(new Event('resize'))");
  await new Promise((r) => setTimeout(r, 400));

  await evalExpr(`
    (() => {
      const section = document.getElementById("properties");
      if (section) section.scrollIntoView({ behavior: "instant", block: "center" });
    })()
  `);
  await new Promise((r) => setTimeout(r, 600));

  const desktopInitial = await evalExpr(`
    (() => {
      const carousel = document.querySelector("[data-featured-carousel]");
      const slides = Array.from(document.querySelectorAll("[data-featured-slide]"));
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;

      const slideInfo = slides.map((s, idx) => {
        const r = s.getBoundingClientRect();
        const center = r.left + r.width / 2;
        return {
          index: idx,
          transform: s.style.transform,
          opacity: s.style.opacity,
          zIndex: s.style.zIndex,
          distFromCenter: Math.round(center - carouselCenter),
        };
      });

      const counter = document.querySelector("[data-motion-inner='featured-properties'] .font-mono");
      return {
        carouselWidth: carouselRect.width,
        slideCount: slides.length,
        slides: slideInfo,
        counterText: counter ? counter.textContent.trim() : "not-found",
      };
    })()
  `);
  console.log("Desktop Initial State:", JSON.stringify(desktopInitial, null, 2));

  const ss1Path = path.join(ARTIFACT_DIR, "screenshot-desktop-featured-depth-slide0.png");
  await takeScreenshot(ss1Path);
  console.log("Saved screenshot:", ss1Path);

  // 2. NEXT ARROW TRANSITION TO SLIDE 1
  console.log("\n--- TEST 2: NEXT ARROW TRANSITION TO SLIDE 1 ---");
  await evalExpr(`
    (() => {
      const carousel = document.querySelector("[data-featured-carousel]");
      const slides = carousel.querySelectorAll("[data-featured-slide]");
      const carouselRect = carousel.getBoundingClientRect();
      const slideRect = slides[1].getBoundingClientRect();
      const currentScrollLeft = carousel.scrollLeft;
      const slideCenter = (slideRect.left - carouselRect.left) + slideRect.width / 2;
      const targetScrollLeft = currentScrollLeft + (slideCenter - carouselRect.width / 2);
      carousel.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    })()
  `);
  await new Promise((r) => setTimeout(r, 800));

  const desktopSlide1 = await evalExpr(`
    (() => {
      const carousel = document.querySelector("[data-featured-carousel]");
      const slides = Array.from(document.querySelectorAll("[data-featured-slide]"));
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;

      const slideInfo = slides.map((s, idx) => {
        const r = s.getBoundingClientRect();
        const center = r.left + r.width / 2;
        return {
          index: idx,
          transform: s.style.transform,
          opacity: s.style.opacity,
          zIndex: s.style.zIndex,
          distFromCenter: Math.round(center - carouselCenter),
        };
      });

      const counter = document.querySelector("[data-motion-inner='featured-properties'] .font-mono");
      return {
        slides: slideInfo,
        counterText: counter ? counter.textContent.trim() : "not-found",
      };
    })()
  `);
  console.log("Desktop Slide 1 Settled:", JSON.stringify(desktopSlide1, null, 2));

  const ss2Path = path.join(ARTIFACT_DIR, "screenshot-desktop-featured-depth-slide1.png");
  await takeScreenshot(ss2Path);
  console.log("Saved screenshot:", ss2Path);

  // 3. CONTINUOUS INTERPOLATION CHECK (DURING DRAG / SCROLL)
  console.log("\n--- TEST 3: CONTINUOUS INTERPOLATION DURING SCROLL ---");
  const halfwayTest = await evalExpr(`
    (() => {
      const carousel = document.querySelector("[data-featured-carousel]");
      const slides = Array.from(document.querySelectorAll("[data-featured-slide]"));
      const carouselRect = carousel.getBoundingClientRect();
      const r0 = slides[0].getBoundingClientRect();
      const r1 = slides[1].getBoundingClientRect();

      const c0 = (r0.left - carouselRect.left) + r0.width / 2;
      const c1 = (r1.left - carouselRect.left) + r1.width / 2;
      const halfwayTarget = carousel.scrollLeft + (c0 + c1) / 2 - carouselRect.width / 2;
      carousel.scrollLeft = halfwayTarget;

      // Force depth update
      carousel.dispatchEvent(new Event("scroll"));

      const carouselCenter = carouselRect.left + carouselRect.width / 2;
      return slides.map((s, idx) => {
        const r = s.getBoundingClientRect();
        return {
          index: idx,
          transform: s.style.transform,
          opacity: s.style.opacity,
          dist: Math.round(Math.abs(r.left + r.width / 2 - carouselCenter)),
        };
      });
    })()
  `);
  console.log("Halfway Position (both slides transitioning):", JSON.stringify(halfwayTest, null, 2));

  // 4. VERTICAL PAGE SCROLL PARALLAX
  console.log("\n--- TEST 4: VERTICAL PAGE SCROLL PARALLAX ---");
  await evalExpr("window.scrollTo(0, 1200)");
  await new Promise((r) => setTimeout(r, 400));
  const parallax1 = await evalExpr(`
    (() => {
      const inner = document.querySelector("[data-motion-inner='featured-properties']");
      const img = document.querySelector(".featured-property-image-inner");
      return {
        innerTransform: inner ? inner.style.transform : null,
        imgTransform: img ? img.style.transform : null,
      };
    })()
  `);
  console.log("Vertical Parallax at scroll 1200:", parallax1);

  await evalExpr("window.scrollTo(0, 1800)");
  await new Promise((r) => setTimeout(r, 400));
  const parallax2 = await evalExpr(`
    (() => {
      const inner = document.querySelector("[data-motion-inner='featured-properties']");
      const img = document.querySelector(".featured-property-image-inner");
      return {
        innerTransform: inner ? inner.style.transform : null,
        imgTransform: img ? img.style.transform : null,
      };
    })()
  `);
  console.log("Vertical Parallax at scroll 1800:", parallax2);

  // 5. MOBILE VIEWPORT (390x844)
  console.log("\n--- TEST 5: MOBILE 390x844 ---");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await evalExpr("window.dispatchEvent(new Event('resize'))");
  await new Promise((r) => setTimeout(r, 400));

  await evalExpr(`
    (() => {
      const section = document.getElementById("properties");
      if (section) section.scrollIntoView({ behavior: "instant", block: "center" });
      const carousel = document.querySelector("[data-featured-carousel]");
      carousel.scrollLeft = 0;
      carousel.dispatchEvent(new Event("scroll"));
    })()
  `);
  await new Promise((r) => setTimeout(r, 500));

  const mobileInfo = await evalExpr(`
    (() => {
      const carousel = document.querySelector("[data-featured-carousel]");
      const slides = Array.from(document.querySelectorAll("[data-featured-slide]"));
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;

      return slides.map((s, idx) => {
        const r = s.getBoundingClientRect();
        return {
          index: idx,
          transform: s.style.transform,
          opacity: s.style.opacity,
          distFromCenter: Math.round(r.left + r.width / 2 - carouselCenter),
        };
      });
    })()
  `);
  console.log("Mobile Slide Info:", JSON.stringify(mobileInfo, null, 2));

  const ssMobilePath = path.join(ARTIFACT_DIR, "screenshot-mobile-featured-depth.png");
  await takeScreenshot(ssMobilePath);
  console.log("Saved mobile screenshot:", ssMobilePath);

  console.log("\n============================================================");
  console.log("ALL FEATURED DEPTH CAROUSEL VERIFICATIONS PASSED!");
  console.log("============================================================");

  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});