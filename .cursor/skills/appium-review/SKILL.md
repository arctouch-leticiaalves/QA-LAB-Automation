---
name: appium-review
description: Reviews pull requests that add or modify Appium WebdriverIO tests for the QA-Lab Android project, prioritizing correctness, anti-flake patterns, selector quality, scope, and Gherkin conventions before style. Use when the user asks to review a PR, review test changes, look at a diff of feature/step/screen files, or wants a senior Appium engineer to give feedback.
---

# Appium Review

Review with the priority order below. Lead with blocking issues, not nits. Every blocking issue must reference `file:line`.

## Priority order

1. Correctness — does it actually assert the behavior the title claims.
2. AAA discipline — Given/When/Then map cleanly to Arrange/Act/Assert; no phase mixing.
3. Anti-flake — explicit waits, no `pause`, no swallowed errors.
4. Locator quality — follows `appium-selectors` priority.
5. Scope — only files needed by the change.
6. Page Object discipline — no locators, `driver.*`, or assertions in steps; no phase-mixing methods.
7. Gherkin convention — formatting, tags, no quotes in titles.
8. Test value — covers risk that justifies the maintenance cost.
9. CI impact — runtime, retries, parallelism.
10. Readability and naming.

## Blocking checklist

A finding in this section blocks merge.

### Correctness

- [ ] Each `Then` would fail when the behavior breaks (not just "screen rendered").
- [ ] No tautological assertion (asserting the value the code just set).
- [ ] Tests do not depend on order or shared mutable state across scenarios.
- [ ] Test data is realistic enough to expose the failure mode (not all `"test"` / `"123"`).

### AAA discipline

- [ ] Every scenario has at least one `When` (or a `#` comment justifying its absence — e.g. wiring smoke).
- [ ] Default of exactly one `When` per scenario. Multiple `When`s are flagged unless the PR explicitly justifies the composite behavior.
- [ ] `Given` steps do NOT perform the user action under test.
- [ ] `Then` steps contain only assertions — no `setValue`, `click`, `terminate`, `activate`.
- [ ] Screen Object / support methods belong to exactly one AAA phase (Setup, Action, or Query). No `loginAndExpect*` mixed-phase methods.
- [ ] If a step calls `driver.*` or `$(...)` directly, that logic must be moved into a Screen Object or `src/support/*` helper.

### Anti-flake

- [ ] No `browser.pause(...)` introduced. Existing ones are not increased.
- [ ] Every action is preceded by `waitForDisplayed` / `waitForEnabled` or a `waitUntil` predicate.
- [ ] No try/catch swallowing errors.
- [ ] No `specFileRetries` bump above 1.
- [ ] Screen navigations return the next Screen Object and wait on it.

### Locator quality

- [ ] Locators follow priority: accessibility id → resource id → UiSelector → xpath.
- [ ] XPath, if present, has a comment explaining why and an entry in `LOCATOR_DEBT.md`.
- [ ] No locator string duplicated across files.
- [ ] No `findElementBy*` constructed from string concatenation with test data.

### Scope

- [ ] Only files needed by the stated change. No drive-by reformat or unrelated refactor.
- [ ] No public API or shared helper changed without an explicit reason in the PR description.
- [ ] No dependency added without justification.

### Page Object discipline

- [ ] Steps call Screen Object / support methods only. No `$('~...')`, no `driver.*`, no `browser.*` in steps.
- [ ] No assertions inside Screen Objects.
- [ ] One screen per file. New shared screen lives under `src/screens/`, not `src/steps/`.
- [ ] App-level lifecycle (install check, launch, terminate, current activity/package) lives in `src/support/app.actions.ts`, not in a Screen Object.
- [ ] Method names describe user intent, not framework operations.
- [ ] Each method is single-phase (Setup OR Action OR Query, never two).
- [ ] No `appPackage` / `appActivity` string hardcoded — comes from `src/config/app.constants.ts`.

### Gherkin convention

- [ ] No quotation marks in scenario titles.
- [ ] Two-space indent for Given/When/Then; four-space for And.
- [ ] `Examples` indented two spaces; header row one-space pipes, rows two-space pipes; pipes vertically aligned.
- [ ] Tags include exactly one suite tag (`@smoke`/`@regression`/`@e2e`), one area tag, `@android`, and one risk tag.
- [ ] `# AUTOMATION_TBD` annotation present on critical/smoke scenarios.

## Concern checklist (not blocking, but call out)

- [ ] Step regex could be simplified to fewer capture groups.
- [ ] Scenario name could be more behavior-focused.
- [ ] Screen Object grew past 200 lines or 8 methods — consider splitting.
- [ ] Suite runtime increased significantly — note in PR.

## Findings format

Use this exact shape so reviews are consistent and scannable.

```
🔴 Blocking — features/login.feature:14
  The Then step only checks the welcome banner is displayed but the
  scenario claims to verify the user lands on the home screen. The
  assertion will pass even if the welcome banner is shown on the
  login screen during a transient state.
  Suggested: assert HomeScreen.isLoaded() and getWelcomeText().

🟡 Concern — src/steps/login.steps.ts:22
  The regex `(.+) and (.+)` is greedy and will misparse emails that
  contain the word "and". Consider `(\S+)` for the email capture.

🟢 Suggestion — src/screens/home.screen.ts:8
  Naming: `welcomeMsg` → `welcomeBanner` matches the screen vocabulary
  used elsewhere.
```

End every review with one explicit decision:

- `Approve` — no blockers, concerns acknowledged.
- `Approve with comments` — concerns to address in this PR.
- `Request changes` — at least one blocker.
- `Block` — multiple blockers and the change should be split.

## What this review explicitly does NOT cover

- Product code in the Android app repo. Out of scope for this skill.
- Backend or API contracts. Out of scope.
- Performance benchmarks. Out of scope until requested.

## Common rationalizations to refuse

| Rationalization | Required response |
|---|---|
| "Tests pass, so it is fine." | Confirm the assertions exercise the changed behavior. |
| "I added pause because waitForDisplayed was flaky." | Diagnose the flake; do not paper over it. |
| "I will refactor the Screen Object in a follow-up." | Keep the diff coherent; if the change requires the refactor, do it here. |
| "Senior dev wrote it, LGTM." | The review's job is to verify, not to defer. |
| "It is a small change." | Small changes still need an assertion that fails when broken. |

## Related skills

- `appium-write-test` — what good tests look like.
- `appium-selectors` — locator priority.
- `appium-page-object` — Screen Object rules.
- `appium-debug` — when the PR claims to fix a flake.
