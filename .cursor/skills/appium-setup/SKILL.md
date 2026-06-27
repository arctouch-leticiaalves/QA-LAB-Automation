---
name: appium-setup
description: Bootstraps the QA-Lab Android automation project with WebdriverIO + TypeScript + Appium 2 + UiAutomator2 driver and Cucumber. Use when starting the repo from scratch, adding a new machine to the project, recreating wdio.conf.ts, or when the user asks to "setup", "scaffold", "initialize", or "configure" the Appium/WDIO project.
---

# Appium Setup (Android · WDIO · TS · Cucumber)

This skill scaffolds the QA-Lab automation project. The target is Android native apps only at this stage. iOS, web, and tablet are explicitly out of scope until requested.

## Stack (single source of truth)

| Concern | Choice |
|---|---|
| Runner | WebdriverIO v9 |
| Language | TypeScript (`strict: true`) |
| Automation server | Appium v2 |
| Android driver | `appium-uiautomator2-driver` |
| BDD | `@wdio/cucumber-framework` + Gherkin |
| Reporter | `@wdio/spec-reporter` + `@wdio/allure-reporter` |
| Lint/format | ESLint + Prettier |
| Node | LTS (>= 20). Verify with `node -v` before installing. |

When versions matter (Appium drivers, WDIO, Cucumber), DETECT the installed version from `package.json` / `package-lock.json` before claiming compatibility — never assume from memory.

## Required directory layout

```
QA-Lab/
├── .cursor/skills/                # this skill set (do not edit per-machine)
├── .github/workflows/             # CI lives here (see appium-ci skill)
├── apps/
│   └── android/                   # .apk under test (gitignored, see below)
├── src/
│   ├── screens/                   # Screen Objects (one file per screen)
│   ├── steps/                     # Cucumber step definitions
│   ├── support/                   # hooks, world, helpers, waits
│   └── config/
│       └── capabilities.ts        # Android caps (UiAutomator2)
├── features/                      # .feature files (Gherkin)
├── test-results/                  # allure-results, screenshots, logs (gitignored)
├── wdio.conf.ts                   # base config
├── wdio.android.conf.ts           # Android-specific config extending base
├── tsconfig.json
├── .env.example                   # required env vars (no secrets committed)
├── .gitignore
└── package.json
```

## Bootstrap workflow

Copy this checklist and tick as you go. Do not skip steps; each one is a verification point.

```
- [ ] 1. Verify host prerequisites (Node, JDK, Android SDK, adb)
- [ ] 2. Initialize package.json and install deps
- [ ] 3. Install Appium 2 and uiautomator2 driver
- [ ] 4. Create tsconfig.json (strict TS)
- [ ] 5. Create wdio.conf.ts + wdio.android.conf.ts
- [ ] 6. Create capabilities.ts with required env-driven values
- [ ] 7. Add .env.example, .gitignore, ESLint, Prettier
- [ ] 8. Write a smoke feature + step + screen to prove the wiring
- [ ] 9. Run smoke locally against an emulator
- [ ] 10. Commit
```

### 1. Host prerequisites

```bash
node -v          # >= 20 LTS
java -version    # JDK 17 recommended for Android tooling
adb version      # Android Platform Tools installed
appium -v        # if missing, installed in step 3
```

`ANDROID_HOME` (or `ANDROID_SDK_ROOT`) and `JAVA_HOME` must be exported. If absent, stop and surface the gap — do not invent paths.

### 2. Initialize package and dependencies

```bash
npm init -y
npm i -D typescript ts-node @types/node \
  @wdio/cli @wdio/local-runner \
  @wdio/cucumber-framework @cucumber/cucumber \
  @wdio/spec-reporter @wdio/allure-reporter allure-commandline \
  @wdio/appium-service \
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  prettier eslint-config-prettier \
  dotenv cross-env
```

Verify each package resolves and is current via `npm view <pkg> version` if a version conflict arises. Do not pin to memory.

### 3. Appium 2 and driver

```bash
npx appium driver install uiautomator2
npx appium driver list --installed   # confirm uiautomator2 is present
```

The Appium MCP exposes `install_appium_driver`, `start_appium_server`, and `check_appium_status` — prefer those when running in agent context.

### 4. `tsconfig.json`

Use strict TS. Minimum:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["node", "@wdio/globals/types", "@wdio/mocha-framework", "expect-webdriverio"],
    "outDir": "./.tsbuild",
    "baseUrl": ".",
    "paths": {
      "@screens/*": ["src/screens/*"],
      "@support/*": ["src/support/*"],
      "@config/*": ["src/config/*"]
    }
  },
  "include": ["src/**/*.ts", "features/**/*.ts", "wdio*.ts"]
}
```

### 5. WDIO configs

Two-file split keeps Android-specific values isolated and future iOS/web configs additive without rewriting the base.

`wdio.conf.ts` holds: runner, framework (`cucumber`), reporters, hooks, timeouts, retries (`specFileRetries: 1`), and tsx loader. `wdio.android.conf.ts` imports the base and sets `capabilities` from `@config/capabilities`.

Both files MUST read environment via `dotenv` at the top and fail-loud when required vars are missing.

### 6. Capabilities (Android · UiAutomator2)

```ts
// src/config/capabilities.ts
import 'dotenv/config'

function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

export const androidCaps = [{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:platformVersion': required('ANDROID_PLATFORM_VERSION'),
  'appium:deviceName': required('ANDROID_DEVICE_NAME'),
  'appium:app': required('ANDROID_APP_PATH'),          // absolute path to .apk
  'appium:appWaitActivity': process.env.ANDROID_APP_WAIT_ACTIVITY ?? '*',
  'appium:autoGrantPermissions': true,
  'appium:noReset': false,
  'appium:newCommandTimeout': 240,
}]
```

Do not commit a real `.env`. Commit only `.env.example` with the variable names.

### 7. `.env.example`

```
ANDROID_PLATFORM_VERSION=14
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_APP_PATH=/absolute/path/to/QA-Lab.apk
ANDROID_APP_WAIT_ACTIVITY=*
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
```

### 8. `.gitignore` essentials

```
node_modules/
.tsbuild/
test-results/
allure-results/
allure-report/
*.log
.env
apps/android/*.apk
```

### 9. Smoke proof

Create one Gherkin feature, one step file, and one Screen Object that opens the app and asserts the first screen is visible. The smoke MUST exist before any other test — it is the wiring contract. Refer to `appium-page-object` and `appium-write-test` skills for the exact patterns to follow.

### 10. Verification

Before declaring setup done, run and capture output:

```bash
npx tsc --noEmit
npx eslint . --max-warnings=0
npx wdio run wdio.android.conf.ts --spec features/smoke.feature
```

All three must pass. If the smoke fails, do NOT proceed to build more screens — fix the wiring first (Stop-the-Line).

## Anti-patterns to refuse

- Hard-coding `appium:app` to a path on someone's laptop.
- Committing the `.apk` to git.
- Disabling TypeScript `strict`.
- Adding `wdio.ios.conf.ts` or web configs now (out of scope).
- Pinning a package version without verifying current via `npm view`.
- Catching errors in `capabilities.ts` to "make it work without env" — fail loud.

## Related skills

- For locator strategy decisions, see `appium-selectors`.
- For Screen Object structure, see `appium-page-object`.
- For writing the first test, see `appium-write-test`.
- For CI wiring with an emulator, see `appium-ci`.
