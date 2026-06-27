---
name: appium-ci
description: Builds and maintains the GitHub Actions pipeline that runs Appium + WebdriverIO tests against an Android emulator for the QA-Lab project, including artifact upload, retries, and Allure reporting. Use when the user asks to add or update CI, set up GitHub Actions, configure the Android emulator runner, fix CI failures unrelated to product code, or wire test reports.
---

# Appium CI (GitHub Actions · Android Emulator)

This pipeline runs the Cucumber suite on every PR and on `main`. It targets Android only at this stage.

## Workflow file

Create `.github/workflows/android-e2e.yml`. The exact contents below are the project standard. When updating it, change one concern at a time and explain the diff in the PR.

```yaml
name: Android E2E

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      tag_expression:
        description: Cucumber tag expression (e.g. "@smoke and @android")
        required: false
        default: "@smoke and @android"

concurrency:
  group: android-e2e-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: "20"
  JAVA_VERSION: "17"
  ANDROID_API_LEVEL: "34"
  ANDROID_TARGET: "google_apis"
  ANDROID_ARCH: "x86_64"
  EMULATOR_PROFILE: "pixel_6"

jobs:
  e2e:
    name: Android E2E (API ${{ matrix.api-level }})
    runs-on: ubuntu-latest
    timeout-minutes: 60
    strategy:
      fail-fast: false
      matrix:
        api-level: [34]
        # Add more API levels here when expanding device coverage.

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Enable KVM
        run: |
          echo 'KERNEL=="kvm", GROUP="kvm", MODE="0666", OPTIONS+="static_node=kvm"' \
            | sudo tee /etc/udev/rules.d/99-kvm4all.rules
          sudo udevadm control --reload-rules
          sudo udevadm trigger --name-match=kvm

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm

      - name: Setup JDK
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: ${{ env.JAVA_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npx eslint . --max-warnings=0

      - name: Install Appium driver
        run: npx appium driver install uiautomator2

      - name: Download app under test
        # Replace the source with the project's artifact storage (S3, Azure, GitHub Release).
        # The .apk MUST NOT be committed to git.
        run: |
          mkdir -p apps/android
          echo "TODO: fetch QA-Lab.apk from artifact storage" >&2
          # Example using gh release download:
          # gh release download "$APP_RELEASE_TAG" -R "$ORG/QA-Lab-App" -p "*.apk" -D apps/android/
        env:
          GH_TOKEN: ${{ secrets.APP_DOWNLOAD_TOKEN }}

      - name: Cache AVD
        uses: actions/cache@v4
        id: avd-cache
        with:
          path: |
            ~/.android/avd/*
            ~/.android/adb*
          key: avd-${{ matrix.api-level }}-${{ env.ANDROID_TARGET }}-${{ env.ANDROID_ARCH }}

      - name: Warm up AVD (cache miss only)
        if: steps.avd-cache.outputs.cache-hit != 'true'
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: ${{ matrix.api-level }}
          target: ${{ env.ANDROID_TARGET }}
          arch: ${{ env.ANDROID_ARCH }}
          profile: ${{ env.EMULATOR_PROFILE }}
          force-avd-creation: false
          emulator-options: -no-window -gpu swiftshader_indirect -noaudio -no-boot-anim -camera-back none
          disable-animations: true
          script: echo "AVD warm"

      - name: Run E2E suite
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: ${{ matrix.api-level }}
          target: ${{ env.ANDROID_TARGET }}
          arch: ${{ env.ANDROID_ARCH }}
          profile: ${{ env.EMULATOR_PROFILE }}
          force-avd-creation: false
          emulator-options: -no-window -gpu swiftshader_indirect -noaudio -no-boot-anim -camera-back none
          disable-animations: true
          script: |
            adb wait-for-device
            adb shell input keyevent 82 || true
            export ANDROID_PLATFORM_VERSION=14
            export ANDROID_DEVICE_NAME=$(adb devices | awk 'NR==2{print $1}')
            export ANDROID_APP_PATH=$GITHUB_WORKSPACE/apps/android/QA-Lab.apk
            export APPIUM_HOST=127.0.0.1
            export APPIUM_PORT=4723
            npx wdio run wdio.android.conf.ts \
              --cucumberOpts.tagExpression="${{ github.event.inputs.tag_expression || '@smoke and @android' }}"

      - name: Upload Allure results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results-api-${{ matrix.api-level }}
          path: test-results/allure-results
          if-no-files-found: warn
          retention-days: 14

      - name: Upload screenshots and logs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: failure-evidence-api-${{ matrix.api-level }}
          path: |
            test-results/screenshots
            test-results/logs
          if-no-files-found: warn
          retention-days: 14
```

## Why these choices

- **`reactivecircus/android-emulator-runner@v2`** — community standard for booting an emulator inside `ubuntu-latest`. Handles KVM, cold boot, AVD cache.
- **AVD cache step** — without it, cold boot dominates the run. The cache key includes API level, target, and arch.
- **`fail-fast: false`** in matrix — one API level should not block the others while we expand coverage.
- **Two emulator-runner steps** — first warms the AVD if cache misses; second runs the suite reusing the warm AVD.
- **`concurrency` group** — cancels superseded PR runs to save minutes.
- **`if: always()` artifact upload** — Allure results upload even on failure; failure-only step adds raw screenshots and Appium logs.
- **Tag expression input** — `workflow_dispatch` lets reviewers re-run with a custom tag (`@regression and @android`) without editing the file.

## Required repository secrets and variables

| Name | Type | Used by | Purpose |
|---|---|---|---|
| `APP_DOWNLOAD_TOKEN` | secret | Download app step | Pull `.apk` from the app repository's releases or artifact storage. |
| `XRAY_CLIENT_ID` | secret (optional) | Future reporting | Pushing results to Xray (out of scope here). |
| `XRAY_CLIENT_SECRET` | secret (optional) | Future reporting | Same. |

Do NOT add secrets you do not yet need. Add them when the workflow step that consumes them lands.

## Retry policy

WDIO config sets `specFileRetries: 1`. CI does not add a job-level retry — flaky tests must be diagnosed via `appium-debug`, not papered over. The Beyoncé Rule applies: once a flake is fixed, add a regression test for the failure mode.

## What this workflow intentionally does NOT do

- Run against physical devices. That requires a device farm (BrowserStack, SauceLabs, AWS Device Farm) and a separate workflow.
- Push results to Xray. That is a follow-up wired by a separate skill once Xray credentials and the project key are confirmed.
- Run iOS, web, or tablet. Out of scope until requested.
- Auto-promote `.apk` versions. The app artifact source is fetched as-is from the app repo.

## Verification before merging CI changes

- [ ] Workflow file passes `gh actions-lint` or `actionlint` locally.
- [ ] Triggered run on a draft PR completes (green or with diagnosed failure) within the timeout.
- [ ] Artifacts upload (Allure + failure evidence) on a deliberately failing scenario.
- [ ] Cache hit on the second run (`avd-cache` step reports `cache-hit: true`).
- [ ] No secret leaked into logs (review the raw log for the download step).

## Related skills

- `appium-setup` — local equivalent of these env vars and config.
- `appium-debug` — what to do when the pipeline fails and the screenshot is not enough.
- `appium-review` — review checklist for PRs that change CI.
