# QA-Lab Automation

End-to-end automation suite for the **QA-Lab Android demo app** (`com.arctouch.arctouch_demo_app`), built with **WebdriverIO + TypeScript + Appium 2 (UiAutomator2) + Cucumber**.

The suite ships with `.cursor/skills/` — a set of project-scoped Cursor Agent Skills that document the team's conventions (Page Object Model, AAA pattern, locator priority, anti-flake patterns, CI, debug, review).

## Stack

| Concern | Choice |
|---|---|
| Runner | WebdriverIO 9 |
| Language | TypeScript (`strict: true`) |
| Automation server | Appium 3 |
| Android driver | `appium-uiautomator2-driver` |
| BDD | `@wdio/cucumber-framework` + Gherkin |
| Reporter | Allure + Spec |
| CI | GitHub Actions + `reactivecircus/android-emulator-runner` |

## Scope

- **Android only**. iOS, web, tablet-specific runs, physical device farms, performance and API testing are out of scope until requested.

## Conventions

Enforced by the skills in `.cursor/skills/`:

- **AAA pattern** mapped to Gherkin (`Given` = Arrange · `When` = Act · `Then` = Assert).
- **Page Object Model** with each public method classified as Setup / Action / Query.
- **Locator priority**: accessibility-id → resource-id → UiSelector → XPath (last resort, must be logged in `LOCATOR_DEBT.md`).
- **No `browser.pause`**, no `driver.*` in steps, no assertions in Page Objects.
- Steps are thin orchestration: call Screen Object / `src/support/*` methods and assert.
- Test data and selectors live in `src/config/*.constants.ts` — never inlined in screens or steps.

## Project layout

```
QA-Lab/
├── .cursor/skills/             # Agent skills (PO, AAA, selectors, CI, debug, review)
├── .github/workflows/          # GitHub Actions pipelines
├── apps/android/QA-Lab.apk     # App under test (committed for demo simplicity)
├── features/                   # .feature files (Gherkin, AAA)
├── src/
│   ├── config/                 # capabilities + app constants
│   ├── screens/                # Screen Objects (POM)
│   ├── steps/                  # Cucumber step definitions (thin)
│   └── support/                # base.screen, app.actions, hooks
├── test-results/               # gitignored — Allure, screenshots, logs
├── wdio.conf.ts                # base WDIO config
├── wdio.android.conf.ts        # Android config (caps + Appium service)
├── tsconfig.json
├── package.json
└── LOCATOR_DEBT.md             # elements awaiting contentDescription from the app team
```

## Setup (local)

### Prerequisites

- **Node** 20 LTS or newer
- **JDK** 17 (Java 11 works but 17 is recommended)
- **Android Platform Tools** (`adb` on PATH)
- `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) and `JAVA_HOME` exported
- A connected Android device with USB debugging enabled, **or** an Android emulator running locally

### Install

```bash
git clone git@github.com:arctouch-leticiaalves/QA-LAB-Automation.git
cd QA-LAB-Automation
npm ci
APPIUM_HOME="$(pwd)/.appium" npx appium driver install uiautomator2
cp .env.example .env
```

Edit `.env` and set `ANDROID_DEVICE_NAME` (and optionally `ANDROID_UDID`) to your device. Run `adb devices -l` to discover the serial.

### Run

```bash
# Smoke (fast wiring proof, ~10s)
npm run test:android:smoke

# Regression (full login suite, ~50s on a real device)
npm run test:android:regression

# Everything tagged @android
npm run test:android

# Type and lint checks
npm run typecheck
npm run lint
```

The Appium server is started automatically by `@wdio/appium-service`. `APPIUM_HOME` is pinned to the project's `.appium/` so drivers are isolated per repo (export it in your shell or let the scripts handle it).

## Continuous integration

`.github/workflows/android-e2e.yml` runs on every pull request and push to `main`. Two parallel jobs:

| Job | Runs on | Duration | Triggers |
|---|---|---|---|
| `static-checks` | `ubuntu-latest` | ~1 min | typecheck + lint |
| `android-e2e` | `ubuntu-latest` (KVM) | ~6–10 min | Android emulator (API 34), full smoke suite |

The E2E job boots an Android 14 (API 34) emulator via `reactivecircus/android-emulator-runner`, installs the APK from `apps/android/QA-Lab.apk`, runs the `@smoke and @android` suite, and uploads Allure results plus failure screenshots/logs as artifacts.

Trigger a custom run via `workflow_dispatch` and pass a Cucumber tag expression in the `tag_expression` input (e.g. `@regression and @android`).

## Skills (Cursor)

Project-scoped skills under `.cursor/skills/` teach the Cursor agent how this codebase wants tests written, reviewed, and debugged. They are versioned with the repo so the whole team and any Cursor agent share the same conventions.

| Skill | Use case |
|---|---|
| `appium-setup` | Bootstrap the project, recreate config, onboard a new machine |
| `appium-selectors` | Pick or refactor an Android locator |
| `appium-page-object` | Create or refactor a Screen Object (POM) |
| `appium-write-test` | Write a Cucumber feature + step definitions in AAA |
| `appium-ci` | Add or update the GitHub Actions pipeline |
| `appium-debug` | Diagnose flaky or failing tests (5-step triage) |
| `appium-review` | Review a PR that touches tests |

## Known shortcuts (to revisit)

These were intentional trade-offs to ship the first iteration fast. Track and pay them down as the project matures.

| Shortcut | Why | Future move |
|---|---|---|
| `apps/android/QA-Lab.apk` committed (57 MB) | CI works out-of-the-box, demo simplicity | Move to a GitHub Release and use `gh release download` in CI, or use Git LFS |
| `LOCATOR_DEBT.md` lists email/password fields needing `contentDescription` | Forced to use XPath with `hint` matching | App team to add accessibility IDs; replace XPath with `~emailField` and `~passwordField` |
| Single device coverage (Galaxy S25 Ultra / Android 16 local, API 34 in CI) | Validate the pipeline first | Expand CI matrix to API 30 / 32 / 34 once stable |
| Negative login scenarios assert generic `errorBanner` visibility | App returns the same error text for all invalid cases | Update asserts when product differentiates errors per case |
| No physical device farm (Sauce / BrowserStack) | Out of scope for now | Add when coverage on real devices becomes a requirement |
