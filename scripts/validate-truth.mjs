import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const isProductionAudit = process.argv.includes("--production-audit");

console.log("------------------------------------------------------------");
console.log("Real-Estate Website Intelligence: Truth & Safety Validator");
console.log(`Mode: ${isProductionAudit ? "STRICT PRODUCTION AUDIT" : "DEVELOPMENT VERIFICATION"}`);
console.log("------------------------------------------------------------\n");

let issues = [];

const readJson = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(content);
};

// Load config files
const companyConfig = readJson(path.join(rootDir, "config", "company.config.json"));
const strategyConfig = readJson(path.join(rootDir, "config", "strategy.config.json"));
const estatesData = readJson(path.join(rootDir, "config", "estates.data.json"));

// Rule 1: Check for fake urgency strings
const fakeUrgencyTokens = ["SELLING FAST", "LIMITED PLOTS", "LAST CHANCE", "HURRY NOW", "ALMOST SOLD OUT"];

function checkFakeUrgency(obj, context) {
  const str = JSON.stringify(obj).toUpperCase();
  for (const token of fakeUrgencyTokens) {
    if (str.includes(token)) {
      issues.push({
        severity: "ERROR",
        message: `Forbidden fake-urgency token detected in ${context}: "${token}". Use factual operational statuses only (e.g. AVAILABLE, NEW_LAUNCH, PHASE_1_ALLOCATED).`
      });
    }
  }
}

// Rule 2: Check for unearned appreciation or guaranteed safety claims
const unearnedClaims = [
  "GUARANTEED APPRECIATION", 
  "RAPID APPRECIATION", 
  "100% LEGALLY SAFE", 
  "TITLE GUARANTEED", 
  "FREE NO-PRESSURE"
];

function checkUnearnedClaims(obj, context) {
  const str = JSON.stringify(obj).toUpperCase();
  for (const claim of unearnedClaims) {
    if (str.includes(claim)) {
      issues.push({
        severity: "ERROR",
        message: `Forbidden unearned claim detected in ${context}: "${claim}". Never normalize speculative appreciation or absolute legal guarantees.`
      });
    }
  }
}

// Rule 3: Check production audit for synthetic fixtures
if (isProductionAudit) {
  if (companyConfig._meta?.status === "SYNTHETIC_FIXTURE") {
    issues.push({
      severity: "BLOCKER",
      message: "company.config.json is still using SYNTHETIC_FIXTURE metadata. Must be replaced with verified prospect facts for client presentation."
    });
  }
  if (strategyConfig._meta?.status === "SYNTHETIC_FIXTURE") {
    issues.push({
      severity: "BLOCKER",
      message: "strategy.config.json is still using SYNTHETIC_FIXTURE metadata. Must be verified and approved per prospect."
    });
  }
  for (const estate of estatesData) {
    if (estate.isSyntheticFixture) {
      issues.push({
        severity: "BLOCKER",
        message: `Estate "${estate.name}" is marked isSyntheticFixture: true. Synthetic fixtures must not be presented to real clients without disclosure.`
      });
    }
  }
}

// Run content checks
checkFakeUrgency(strategyConfig, "strategy.config.json");
checkFakeUrgency(estatesData, "estates.data.json");
checkUnearnedClaims(strategyConfig, "strategy.config.json");
checkUnearnedClaims(estatesData, "estates.data.json");

// Validate Estate Data Integrity
for (const estate of estatesData) {
  if (!estate.id || !estate.name || !estate.slug) {
    issues.push({ severity: "ERROR", message: `Estate missing core identity: ${JSON.stringify(estate)}` });
  }
  if (!estate.location || !estate.location.city || !estate.location.state) {
    issues.push({ severity: "ERROR", message: `Estate "${estate.name}" missing location details.` });
  }
  if (!estate.title || !estate.title.statutoryType) {
    issues.push({ severity: "ERROR", message: `Estate "${estate.name}" missing legal title description.` });
  }
}

console.log(`Audit finished. Found ${issues.length} issue(s).`);

if (issues.length > 0) {
  for (const issue of issues) {
    console.log(`[${issue.severity}] ${issue.message}`);
  }
  if (issues.some(i => i.severity === "BLOCKER" || i.severity === "ERROR")) {
    console.error("\n❌ Truth & Safety Validation FAILED.");
    process.exit(1);
  }
} else {
  console.log("✅ All Truth, Placeholder & Anti-Slop checks PASSED.");
}
