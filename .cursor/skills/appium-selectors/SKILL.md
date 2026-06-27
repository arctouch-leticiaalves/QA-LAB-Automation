---
name: appium-selectors
description: Chooses robust, fast, and stable locators for Android UI elements with Appium UiAutomator2. Use when writing a new Screen Object, refactoring a flaky locator, debugging "element not found", or when the user mentions selectors, locators, by, accessibility id, content-desc, resource-id, xpath, or UiSelector.
---

# Appium Selectors (Android · UiAutomator2)

Stable locators are the single biggest predictor of test reliability. Apply this priority order without negotiation unless evidence proves a lower-priority strategy is the only option.

## Priority order

| # | Strategy | WDIO syntax | When to use |
|---|---|---|---|
| 1 | Accessibility ID (`content-desc`) | `~loginButton` | First choice. Stable, semantic, fast, also helps a11y. Ask devs to set `contentDescription`. |
| 2 | Resource ID | `android=new UiSelector().resourceId("com.qalab.app:id/login_btn")` | Second choice. Stable across releases if the dev team treats it as an ID contract. |
| 3 | UiSelector chain (text, class, instance) | `android=new UiSelector().className("android.widget.Button").text("Login")` | Use only when 1 and 2 are unavailable. Avoid text on localized strings. |
| 4 | XPath | `//android.widget.Button[@text="Login"]` | Last resort. Slow, fragile, breaks on layout changes. Document why it was chosen in a code comment. |

Image-based selectors (`-image`) are forbidden in this project — they are non-deterministic and slow CI.

## Decision flow

When picking a locator for an element, follow this exact order:

1. Open the app, capture the page source (`get_page_source` MCP tool or `driver.getPageSource()`).
2. Check if the element has a non-empty `content-desc`. If yes → use Accessibility ID. Done.
3. Else, check `resource-id`. If yes and it follows `<package>:id/<name>` → use Resource ID. Done.
4. Else, check whether a stable UiSelector chain exists (class + non-localized text, or class + instance index that does not depend on data).
5. Only then consider XPath. When choosing XPath, prefer attribute predicates over positional axes.

## WDIO usage patterns

```ts
// 1. Accessibility ID — preferred
await $('~loginButton').click()

// 2. Resource ID
await $('android=new UiSelector().resourceId("com.qalab.app:id/login_btn")').click()

// 3. UiSelector chain
await $(
  'android=new UiSelector().className("android.widget.EditText").instance(0)'
).setValue('user@example.com')

// 4. XPath — last resort, document why
// XPath used because the dev team has not added resource-id to dynamic list items.
// Tracking: TICKET-1234
await $('//android.widget.TextView[contains(@text,"Order #")]').click()
```

## Locator hygiene

- Wrap every locator in the Screen Object — NEVER let raw locator strings leak into step definitions or features.
- Name elements by intent, not by widget type: `submitButton`, not `btn1` or `androidButton3`.
- A single Screen Object MUST own one screen's locators. If two screens share an element, lift it to a `support/common-selectors.ts` only after the duplication appears at least twice (rule of three).
- One locator per element. If you need a second locator for the "same" element, the screen has actually changed state — model it as a different element.

## Forbidden patterns

- `//*[@text="..."]` with no class scope — matches across the whole tree.
- Index-only locators like `(//android.widget.Button)[3]` — break on any layout change.
- `findElementByAndroidUIAutomator` strings built via string concatenation with user input — injection-shaped and unreadable.
- Sleeping (`browser.pause`) instead of waiting for an element. Use `waitForDisplayed`, `waitForEnabled`, or `waitUntil` with a predicate.
- Locator strings duplicated across files — extract to the Screen Object.

## Waits — paired with locators

Locators without explicit waits cause 80% of flake. Default pattern:

```ts
const el = await $('~submitButton')
await el.waitForDisplayed({ timeout: 10_000 })
await el.waitForEnabled({ timeout: 5_000 })
await el.click()
```

For lists or async loads, prefer `waitUntil`:

```ts
await browser.waitUntil(
  async () => (await $$('~orderRow')).length > 0,
  { timeout: 15_000, timeoutMsg: 'Expected at least one order to render' }
)
```

Never use `browser.pause()` to mask a missing wait. If a wait is genuinely needed for animation, add a comment with the reason and link the ticket.

## Asking the dev team

When the only viable locator is XPath, file a ticket requesting `contentDescription` or `resource-id` on that element. Add the request to a `LOCATOR_DEBT.md` in the repo root so it does not get forgotten. This skill is for QA only — it does not authorize editing the app source.

## Verification

Before opening a PR with a new locator, confirm:

- [ ] Locator priority order respected.
- [ ] No `browser.pause` paired with the locator.
- [ ] Locator lives in a Screen Object, not in a step.
- [ ] If XPath, the rationale is in a comment and on the locator-debt list.

## Related skills

- `appium-page-object` — where locators live.
- `appium-debug` — how to inspect the UI tree when picking a locator.
