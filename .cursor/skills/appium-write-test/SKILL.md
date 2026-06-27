---
name: appium-write-test
description: Authors Cucumber Gherkin feature files and matching TypeScript step definitions for Android Appium tests in the QA-Lab project, following the team's formatting and tagging conventions. Use when the user asks to write a new test, convert a manual test case into automation, add a scenario, or wire a feature file to a Screen Object.
---

# Appium Write Test (Gherkin + Step Defs)

## Output structure

For each new test, produce three things in this order:

1. A `.feature` file in `features/` describing user-visible behavior, written in **AAA structure** (see below).
2. A step definitions file in `src/steps/` if a needed step does not exist yet. Steps are **thin orchestration** — they call Screen Object / support methods and assert. No `driver.*`, no `$(...)`, no business logic.
3. Reuse or extend the relevant Screen Object — do NOT put locators or logic in steps.

## AAA pattern (Arrange · Act · Assert)

Every scenario follows AAA, mapped one-to-one onto Gherkin keywords:

| Phase | Gherkin keyword | Purpose | Allowed | Forbidden |
|---|---|---|---|---|
| Arrange | `Given` | Establish preconditions and state. | Verifying installs, seeding data, setting feature flags, restoring app to a known state via `terminate`/`activate`, logging in via API. | Performing the user action under test. |
| Act | `When` | The single user action whose effect is being tested. | One user action (tap, type, swipe, navigate, launch). | Assertions, multi-step flows. |
| Assert | `Then` | Observations and assertions. | `expect(...)`, reading state, reading text, counting elements. | Any `setValue`, `click`, `terminate`, `activate`, or other mutation. |

`And` and `But` inherit the type of the previous keyword. `When ... And the user taps Save` is still Act.

### Hard rules

1. Every scenario MUST have at least one `When`. Exception: harness/smoke that documents the absence in a `#` comment.
2. `Given` does not invoke the action under test. If your only `Given` reads like "Given the user logs in" and login IS the action being tested, that step belongs in `When`.
3. Default to **exactly one `When`** per scenario. Multiple `When`s mean the scenario mixes two behaviors — split it.
4. `Then` never mutates state. If the assertion needs an intermediate action, that action belongs in `When` and a second `Then` follows.
5. Steps are thin. They call Screen Object methods and assert. They do not perform waits, call `driver.*`, or contain conditionals on test data.

### Comment annotation (encouraged while team is learning)

```gherkin
Scenario: Logging in lands the user on the home screen
  # Arrange
  Given the device has the QA-Lab app installed
    And the user has a valid account
  # Act
  When the user logs in with valid credentials
  # Assert
  Then the home screen should be displayed
    And the welcome message should include the user first name
```

Once the team is fluent, the `# Arrange / # Act / # Assert` annotations can be dropped — Given/When/Then carries the semantic.

### AAA reflected in the step file

```ts
// ARRANGE — Given steps
Given(/^the device has the QA-Lab app installed$/, async () => {
  const installed = await app.isInstalled()
  if (!installed) throw new Error(`Precondition failed: app not installed`)
})

// ACT — When steps (exactly one action)
When(/^the user logs in with valid credentials$/, async () => {
  home = await login.signIn(validUser.email, validUser.password)
})

// ASSERT — Then steps (assertions only)
Then(/^the home screen should be displayed$/, async () => {
  expect(await home.isLoaded()).toBe(true)
})
```

## Gherkin formatting rules (project standard)

These rules are non-negotiable for this repo. Reviewers will block PRs that violate them.

1. Do not use quotation marks in scenario titles.
2. Use two spaces before each `Given`, `When`, `Then` statement.
3. Use four spaces before each `And` that follows a `Given/When/Then`.
4. Use two spaces before the `Examples` keyword.
5. In `Examples` tables: one space before each `|` for the header row, two spaces for example rows.
6. Align pipe characters vertically.
7. Comments use `#` — use them for context like Figma links, ticket IDs, or test data sources.

### Reference scenario

```gherkin
# Acceptance: TICKET-1234
# Reference: Figma <link>

Feature: User login

  As a returning user
  I want to sign in with email and password
  So that I can access my account

  @smoke @login @android
  Scenario Outline: Logging in with valid credentials lands on the home screen
    Given the user opens the QA-Lab app
    When the user logs in with <email> and <password>
    Then the home screen should be displayed
      And the welcome message should include <displayName>

    Examples:
       | email                | password    | displayName |
      |  jane@example.com    |  Valid#123  |  Jane       |
      |  john@example.com    |  Valid#456  |  John       |
```

## Tag taxonomy

Apply at least one tag from each row.

| Dimension | Tags | Notes |
|---|---|---|
| Suite | `@smoke`, `@regression`, `@e2e` | Exactly one. |
| Area | `@login`, `@checkout`, `@orders`, ... | One per feature/area. |
| Platform | `@android` | Required while iOS is out of scope. |
| Risk/Flow | `@critical`, `@high`, `@medium`, `@low` | Drives CI scheduling. |
| Status (optional) | `@wip`, `@quarantine`, `@manual-only` | Excluded from main CI run. |

`@critical` + `@smoke` + `@android` is the default for core user journeys (login, checkout, payments, primary booking flows). These are also candidates for the `AUTOMATION_TBD` Xray tag (see the project tagging rule).

## Tag-to-AUTOMATION_TBD mapping

The Xray tag `AUTOMATION_TBD` belongs on scenarios that ARE worth automating. Add it for tests carrying `@critical` or `@smoke`. Remove it for tests that are layout-only, a11y-only, CMS-only, or field-validation-only. The Xray side of this lives in a separate workflow — this skill only flags the candidate in the feature comment:

```gherkin
# AUTOMATION_TBD: yes — core checkout flow, high ROI
```

## Step definition file template

```ts
// src/steps/login.steps.ts
import { Given, When, Then } from '@wdio/cucumber-framework'
import { expect } from 'expect-webdriverio'
import { LoginScreen } from '@screens/login.screen'
import { HomeScreen } from '@screens/home.screen'

let loginScreen: LoginScreen
let homeScreen: HomeScreen

Given(/^the user opens the QA-Lab app$/, async () => {
  loginScreen = new LoginScreen()
  await loginScreen.waitUntilLoaded()
})

When(
  /^the user logs in with (.+) and (.+)$/,
  async (email: string, password: string) => {
    homeScreen = await loginScreen.login(email, password)
  },
)

Then(/^the home screen should be displayed$/, async () => {
  await expect(await homeScreen.isLoaded()).toBe(true)
})

Then(
  /^the welcome message should include (.+)$/,
  async (displayName: string) => {
    const text = await homeScreen.getWelcomeText()
    await expect(text).toContain(displayName)
  },
)
```

## Step authoring rules

- One step file per area (login, checkout, orders…). Avoid a single `steps.ts` god-file. App-level lifecycle steps go in `app.steps.ts`.
- Reuse steps before adding new ones. Search `src/steps/` first.
- Steps call methods on Screen Objects or `src/support/*` helpers — never `$(...)`, never `driver.*`, never raw waits.
- Steps are AAA-classified: a step is either a Given/Arrange, a When/Act, or a Then/Assert. Never mixed.
- Assertions belong in `Then` steps. Use the global `expect` (do NOT `import { expect } from 'expect-webdriverio'` — it double-loads and crashes with `Cannot redefine property: soft`).
- No business logic in steps — push it into the Screen Object or a support helper.
- Step regexes use `(.+)` for free-form values and named capture groups when readability suffers.

## Scenario authoring rules

- One behavior per scenario. If you use the word "and" twice in the title, split it.
- Test public behavior, not implementation (no "the API returns 200", no "the database row exists" — unless the test really IS an API test, which is out of scope here).
- Edge cases (empty, invalid, max length, network error if reachable) live in their own scenarios — not in the happy path.
- Localized text in `Then` must use `contains` style, not exact equality, unless the copy is contract-locked.

## Quality self-check before commit

- [ ] Scenario title describes user-visible behavior, no implementation terms.
- [ ] Gherkin formatting rules above are all satisfied.
- [ ] AAA respected: `Given` only arranges, `When` is the single action under test, `Then` only asserts.
- [ ] At least one `When` (or a `#` comment justifying its absence for a harness/smoke).
- [ ] At least one suite tag, one area tag, `@android`, and one risk tag.
- [ ] No locators, no `driver.*`, no `$(...)`, no `browser.pause` in steps.
- [ ] Steps call only Screen Object / `src/support/*` methods.
- [ ] At least one `Then` assertion that would FAIL if the behavior breaks.
- [ ] No `import { expect } from 'expect-webdriverio'` (use the global `expect`).
- [ ] If the scenario carries `@critical` or `@smoke`, the feature has the `# AUTOMATION_TBD` annotation.
- [ ] `npx tsc --noEmit` passes.
- [ ] The new scenario passes locally against the connected device.

## Anti-patterns to refuse

- Scenarios that only assert "no error thrown" or "screen rendered" without behavior.
- `When` steps with assertions; `Then` steps that perform actions.
- `Given` steps that perform the action the scenario claims to test.
- Multiple `When`s in one scenario (split it).
- `Then I see "Login"` snapshot-style assertions over a long block of UI text.
- Long step regexes that try to be clever — favor multiple readable steps.
- Scenarios marked `@critical` that have no `AUTOMATION_TBD` candidacy reasoning.
- Steps that call `driver.*` or `$(...)` directly — push to Screen Object or support helper.
- `import { expect } from 'expect-webdriverio'` in steps — use the global `expect` injected by `@wdio/runner`.

## Related skills

- `appium-page-object` — where the actions called by steps actually live.
- `appium-selectors` — how the screen finds elements.
- `appium-debug` — when a scenario is flaky or fails locally only.
