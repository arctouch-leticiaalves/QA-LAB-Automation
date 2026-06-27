---
name: appium-debug
description: Diagnoses flaky or failing Appium Android tests in the QA-Lab project using a five-step triage (reproduce → localize → reduce → fix → guard), the UI tree, screenshots, Appium logs, and the Appium MCP tools. Use when a test fails locally only, fails intermittently on CI, errors with "element not found" or "session not created", or when the user mentions flake, flaky, hang, timeout, intermittent, or "works on my machine".
---

# Appium Debug

Apply the five-step triage in order. Skipping a step is the single most common cause of "fix" PRs that do not actually fix anything.

```
- [ ] 1. Reproduce deterministically
- [ ] 2. Localize the failing layer
- [ ] 3. Reduce to the minimal failing input
- [ ] 4. Fix the root cause
- [ ] 5. Guard with a regression test
```

## 1. Reproduce

Before changing any code:

- Capture the exact command that failed (CI log or local).
- Capture the Allure trace, screenshots, and Appium server log.
- Run the same command locally with `--cucumberOpts.tagExpression="<tag of failing scenario>"`.
- If it passes locally on the first try, run it 5 times in a loop. Intermittent ≠ passing.

```bash
for i in 1 2 3 4 5; do
  npx wdio run wdio.android.conf.ts \
    --cucumberOpts.tagExpression="@<area> and @<scenario>" || echo "FAIL on run $i"
done
```

Stop-the-Line: if you cannot reproduce within 10 attempts, the test is environment-sensitive, not code-broken. Move to Localize with that hypothesis explicit.

## 2. Localize

Identify the layer where the failure actually originates. The error message often lies about the root cause.

| Symptom | Likely layer | First check |
|---|---|---|
| `NoSuchElementException` after action | UI tree / locator | Compare current `getPageSource()` with the locator |
| `session not created` | Driver / device | `adb devices`, Appium driver list, capabilities |
| Element found but `click` does nothing | Visibility / overlay | `isClickable`, `isDisplayedInViewport`, system dialog |
| Random timeout on step that usually works | Wait condition | Replace `pause` with explicit wait |
| Fails only on CI | Animation / boot / locale | `disable-animations`, emulator boot time, locale env |
| `Failed to start activity` | App install / wait activity | `appWaitActivity`, `autoGrantPermissions` |

Use these tools to collect evidence (the Appium MCP exposes equivalents):

```ts
await driver.getPageSource()                              // UI tree snapshot
await driver.saveScreenshot('test-results/debug.png')     // visual state
await driver.getCurrentActivity()                         // foreground activity
await driver.getCurrentPackage()                          // foreground package
await driver.queryAppState('com.qalab.app')               // app lifecycle state
```

From the MCP: `get_page_source`, `take_screenshot`, `get_device_info`, `check_appium_status`, `get_app_state`.

## 3. Reduce

Shrink the failing scenario until it is the smallest possible reproducer.

- Comment out unrelated `Given` setup steps; replace with direct app launch.
- Use a hard-coded data row instead of `Examples` to isolate variability.
- If the scenario depends on a previous test, run it standalone with a fresh session.

The goal is a one-screen-deep reproduction. If you cannot reduce it, the failure crosses screens — re-localize with that in mind.

## 4. Fix the root cause

Match the fix to the diagnosis. Avoid these common rationalizations:

| Tempting "fix" | Why it is wrong | What to do instead |
|---|---|---|
| Add `browser.pause(2000)` | Hides timing; flake returns | Add `waitForDisplayed` / `waitUntil` with a real condition |
| Wrap in try/catch | Swallows real failure | Let it fail and fix the locator or wait |
| Switch to XPath | Trades fragility for slowness | Ask devs for `contentDescription` or `resource-id` |
| Increase global timeout | Slows the whole suite | Increase the timeout on the specific wait only |
| Disable the test | Loses coverage | Add `@quarantine`, file ticket, fix within the sprint |
| Retry the spec | Masks bugs | `specFileRetries: 1` is already the cap; do not add more |

When the fix is uncertain, list two or three ranked hypotheses with the evidence for each, and resolve them with evidence — not by editing code and re-running until green.

## 5. Guard (Beyoncé Rule)

For every fixed flake:

- Add a regression scenario that would have failed before the fix.
- If the failure was environmental (locale, time zone, slow CI), add a check in `before()` that fails loudly when the precondition is missing — better an explicit failure than an unrelated flake.

```ts
// src/support/hooks.ts
before(async () => {
  const locale = await driver.getDeviceLocale()
  if (!locale.startsWith('en')) {
    throw new Error(`Tests require en-* locale, got ${locale}`)
  }
})
```

## Quick reference — collecting evidence locally

```bash
# Appium server log to file
npx appium --log appium.log --log-level info

# Live UI tree while a test runs (in another shell)
adb shell uiautomator dump /sdcard/window_dump.xml \
  && adb pull /sdcard/window_dump.xml ./test-results/

# Verbose logcat filtered to the app
adb logcat -s "QA-Lab:V" "*:E" > test-results/logs/logcat.log
```

## Stop conditions

Stop and escalate (write a handoff with what you know, what is uncertain, and the narrower path) when:

- Same hypothesis fails 2–3 times in a row.
- The fix would touch unrelated files.
- The required information is in business context that is not in the repo or ticket.
- The same model has cycled twice on the same diagnosis without progress.

A documented "I do not know yet" is better than a guessed fix that ships.

## Related skills

- `appium-selectors` — when the diagnosis points at a fragile locator.
- `appium-write-test` — when the fix is a new regression scenario.
- `appium-review` — when reviewing someone else's "flake fix".
