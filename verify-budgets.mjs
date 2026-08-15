import { chromium } from "playwright-core";

const APP_URL = "http://localhost:3114";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addCookies([{ name: "NIVO_E2E", value: "1", domain: "localhost", path: "/" }]);

const results = [];

// --- Part 1: render at all widths ---
for (const w of [1440, 768, 390]) {
  const page = await context.newPage();
  await page.setViewportSize({ width: w, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  const resp = await page.goto(APP_URL + "/budgets", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1000);
  const data = await page.evaluate(() => ({
    path: location.pathname,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelector("h1")?.textContent.trim(),
    text: document.body.innerText,
    editButtons: [...document.querySelectorAll("button")].filter((b) => b.textContent.trim() === "Edit").length,
    deleteButtons: [...document.querySelectorAll("button")].filter((b) => b.textContent.trim() === "Delete").length,
  }));
  const t = data.text;
  const checks = {
    atRoot: data.path === "/budgets",
    h1: data.h1 === "Budgets",
    allowance25000: /25,000/.test(t),
    allocated21000: /21,000/.test(t),
    unallocated4000: /4,000 Left to allocate/.test(t),
    branchesListed: /Essentials/.test(t) && /Shopping/.test(t),
    branchAmounts: /15,000/.test(t) && /6,000/.test(t),
    branchSpent: /1,200 spent/.test(t),
    addButton: /Add budget/.test(t),
    editButtons: data.editButtons === 2,
    deleteButtons: data.deleteButtons === 2,
    noOverflow: data.overflowX === 0,
  };
  results.push({ part: "render", width: w, status: resp.status(), checks, fail: Object.values(checks).filter((v) => v === false).length, errors });
  await page.screenshot({ path: `C:\\Users\\HAMEED~1\\AppData\\Local\\Temp\\opencode\\budgets-${w}.png` });
  await page.close();
}

console.log("PART 1 RENDER:", JSON.stringify(results, null, 2));

// --- Part 2: interaction (add -> edit -> delete) ---
const page = await context.newPage();
page.on("pageerror", (e) => console.log("pageerror:", e.message));
await page.goto(APP_URL + "/budgets", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(800);

const step = {};

// Add budget "Food" ₹4000
await page.getByRole("button", { name: /add budget/i }).first().click();
await page.waitForTimeout(400);
step.addModalOpened = await page.getByRole("heading", { name: "Add budget" }).isVisible();
await page.fill("#budget-name", "Food");
await page.fill('input[inputmode="numeric"]', "4000");
await page.getByRole("button", { name: /add budget/i }).last().click();
await page.waitForTimeout(900);
const t1 = await page.evaluate(() => document.body.innerText);
step.foodAdded = /Food/.test(t1) && /4,000/.test(t1);
step.unallocatedZero = /Left to allocate/.test(t1) && !/4,000 Left to allocate/.test(t1);

// Edit Food to ₹5000
await page.locator("li", { hasText: "Food" }).getByRole("button", { name: "Edit" }).click();
await page.waitForTimeout(400);
step.editModalOpened = await page.getByRole("heading", { name: "Edit budget" }).isVisible();
step.prefilled = (await page.locator('input[inputmode="numeric"]').inputValue()).replace(/,/g, "") === "4000";
await page.fill('input[inputmode="numeric"]', "5000");
await page.getByRole("button", { name: /save changes/i }).click();
await page.waitForTimeout(900);
const t2 = await page.evaluate(() => document.body.innerText);
step.foodUpdated = /Food/.test(t2) && /5,000/.test(t2);
step.overAllocated = /-₹1,000/.test(t2) && /Over-allocated/.test(t2);

// Delete Shopping (accept confirm)
page.once("dialog", (dialog) => dialog.accept());
await page.locator("li", { hasText: "Shopping" }).getByRole("button", { name: "Delete" }).click();
await page.waitForTimeout(900);
const t3 = await page.evaluate(() => document.body.innerText);
step.shoppingDeleted = !/Shopping/.test(t3) && /Food/.test(t3);

console.log(JSON.stringify({ part: "interaction", ...step }, null, 2));
await page.screenshot({ path: "C:\\Users\\HAMEED~1\\AppData\\Local\\Temp\\opencode\\budgets-final.png" });
await browser.close();
