# QA-Lab — Cursor Skills

Project-scoped Cursor Agent Skills for automating the **QA-Lab Android app** with **WebdriverIO + TypeScript + Appium 2 (UiAutomator2) + Cucumber**, with **GitHub Actions** for CI.

These skills live in `.cursor/skills/` and are versioned with the repo so the whole team and any Cursor agent use the same conventions.

## Scope (current)

- Platform: **Android only**.
- App type: **Native** (`.apk`).
- Out of scope until requested: iOS, web, tablet-specific runs, physical device farms, performance testing, API testing, Xray result publishing.

## Stack

| Concern | Choice |
|---|---|
| Runner | WebdriverIO v9 |
| Language | TypeScript (`strict: true`) |
| Automation server | Appium v2 |
| Android driver | `appium-uiautomator2-driver` |
| BDD | `@wdio/cucumber-framework` + Gherkin |
| Reporter | Allure + Spec |
| CI | GitHub Actions + `reactivecircus/android-emulator-runner` |

## Skill index

| Skill | When to invoke |
|---|---|
| [appium-setup](appium-setup/SKILL.md) | Bootstrap the project, recreate config, onboard a new machine. |
| [appium-selectors](appium-selectors/SKILL.md) | Pick or refactor an Android locator. |
| [appium-page-object](appium-page-object/SKILL.md) | Create or refactor a Screen Object. |
| [appium-write-test](appium-write-test/SKILL.md) | Write a Cucumber feature + step definitions. |
| [appium-ci](appium-ci/SKILL.md) | Add or update the GitHub Actions pipeline. |
| [appium-debug](appium-debug/SKILL.md) | Diagnose flaky or failing tests. |
| [appium-review](appium-review/SKILL.md) | Review a PR that touches tests. |

## Typical task → skill mapping

| You want to… | Read this skill first |
|---|---|
| Start the project from zero | `appium-setup` |
| Automate a new manual test case | `appium-write-test` → `appium-page-object` → `appium-selectors` |
| Fix a test that fails only on CI | `appium-debug` → `appium-ci` |
| Replace an XPath locator | `appium-selectors` |
| Review someone's PR | `appium-review` |
| Add a new device API level to CI | `appium-ci` |

## Conventions enforced across all skills

- **Locator priority:** accessibility id → resource id → UiSelector → xpath. XPath requires a comment and a `LOCATOR_DEBT.md` entry.
- **No `browser.pause`** anywhere. Explicit waits only.
- **No locators or assertions in step definitions.** Locators live in Screen Objects, assertions live in `Then` steps.
- **Gherkin formatting:** no quotes in titles, two-space indent for Given/When/Then, four-space for And, aligned `Examples` pipes.
- **Tags:** every scenario has one suite tag, one area tag, `@android`, and one risk tag.
- **`AUTOMATION_TBD`** annotation on critical and smoke scenarios; absent for layout-only, a11y-only, CMS-only, or field-validation-only tests.
- **TypeScript `strict: true`.** No `any` without an inline justification.
- **Secrets and `.apk` files are never committed.** `.env.example` documents required env vars.

## Adding a new skill

1. Decide if the skill is general enough to share (project scope) or only personal (`~/.cursor/skills/`).
2. Follow the structure used here: one directory, one `SKILL.md`, optional `examples.md`/`reference.md` one level deep.
3. Description in `SKILL.md` frontmatter must be third person and include both WHAT and WHEN.
4. Keep `SKILL.md` under 500 lines; push detail to a reference file.
5. Open a PR; the `appium-review` skill applies to skill changes too.

## MCP integration

The project has an `ArcTouch-Appium-MCP` server available. When operating as an agent, prefer these MCP tools over reinventing shell commands:

| Need | MCP tool |
|---|---|
| Start/stop Appium server | `start_appium_server` / `stop_appium_server` |
| Confirm Appium is up | `check_appium_status` / `ping` |
| List or check a device | `list_devices` / `check_device_status` / `get_device_info` |
| Install/launch/close app | `install_app` / `launch_app` / `close_app` / `uninstall_app` |
| Find UI elements | `find_element` / `find_elements` / `get_page_source` |
| Interact | `tap_element` / `send_keys` / `type_text` / `swipe_screen` / `go_back` |
| Evidence | `take_screenshot` / `get_page_source` |
| Locator strategy advice | `get_strategy_guidance` |
