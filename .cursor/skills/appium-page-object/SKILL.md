---
name: appium-page-object
description: Defines the Screen Object (Page Object Model) pattern for the QA-Lab Android automation in TypeScript. Use when creating a new screen wrapper, refactoring step definitions that contain locators, or when the user mentions Page Object, Screen Object, POM, screen class, or "where do I put this locator".
---

# Appium Page Object (Screen Object for Android)

The Page Object pattern in mobile is commonly called a **Screen Object**: one class per screen, owning its locators and the actions a user can perform on that screen.

## Rules

1. One file per screen, under `src/screens/`. App-level lifecycle (install check, launch, terminate) lives in `src/support/app.actions.ts`, not in a Screen Object.
2. Class name = screen name + `Screen`. Example: `LoginScreen`, `OrderListScreen`.
3. The class extends a shared `BaseScreen` that provides waits, scrolls, and the platform predicate.
4. Locator **strings** live in `src/locators/<name>.locators.ts` (a dedicated folder, not next to the Screen Object) exporting a single `<NAME>_LOCATORS` object marked `as const`. The Screen Object imports that object and wraps each entry in a `private get` returning `ChainablePromiseElement`. Locator strings are NEVER inlined in the Screen Object, NEVER inlined in steps, and NEVER exported individually.
5. Methods describe **user intent**, not framework operations. `login(user, pass)` — not `clickButtonById('login_btn')`.
6. Methods return either `void`, the next Screen Object (for navigations), or a typed value (for reads).
7. No assertions inside Screen Objects. Assertions live in steps/specs.
8. No `console.log`. Use `wdio` logger if needed.
9. No `browser.pause()`. Use waits owned by the Screen Object.

## AAA classification of methods

Every public method on a Screen Object (or support helper) belongs to **exactly one** AAA phase. The phase determines which Gherkin keyword consumes the method.

| Category | Used by | Examples | Return type |
|---|---|---|---|
| **Setup** | `Given` (Arrange) | `terminate()`, `installAccount()`, `seedCart(items)`, `restoreToHome()` | `void` or domain entity |
| **Action** | `When` (Act) | `login(email, pwd)`, `tapCheckout()`, `swipeToNextOnboarding()` | The next Screen Object (for navigations) or `void` |
| **Query** | `Then` (Assert) | `isLoaded()`, `getWelcomeText()`, `getItemCount()`, `isErrorVisible()` | `boolean`, `string`, `number`, `string[]` |

### Mixed-phase methods are forbidden

A method that performs an action AND asserts (e.g. `loginAndExpectHome()`) breaks AAA. Split into:

- `login(...)` — Action. Returns `HomeScreen` (or whatever screen is reached on success).
- `HomeScreen.isLoaded()` — Query. Used by the `Then` step.

A method that performs two actions (e.g. `loginAndAddToCart()`) compresses two `When`s into one and hides the second action from the scenario. Split.

### Where this shows up in a real file

```ts
export class LoginScreen extends BaseScreen {
  // --- Locators (private) ---
  private get emailField() { return $('~emailField') }
  private get passwordField() { return $('~passwordField') }
  private get submitButton() { return $('~loginSubmit') }
  private get inlineError() { return $('~loginInlineError') }

  // --- Query (Assert) ---
  async isLoaded(): Promise<boolean> {
    return this.emailField.isDisplayed()
  }

  // --- Query (Assert) ---
  async getInlineErrorText(): Promise<string> {
    return this.inlineError.getText()
  }

  // --- Setup (Arrange): only used to put the screen in a known state ---
  async waitUntilLoaded(timeoutMs = 10_000): Promise<void> {
    await this.emailField.waitForDisplayed({ timeout: timeoutMs })
  }

  // --- Action (Act): the user intent ---
  async login(email: string, password: string): Promise<HomeScreen> {
    await this.waitUntilLoaded()
    await this.emailField.setValue(email)
    await this.passwordField.setValue(password)
    await this.submitButton.click()
    const home = new HomeScreen()
    await home.waitUntilLoaded()
    return home
  }
}
```

## Locators file layout (mandatory)

Locator strings live in `src/locators/`, NOT alongside the Screen Objects. The folder tree is:

```
src/
├── locators/
│   ├── login.locators.ts
│   └── shop.locators.ts
└── screens/
    ├── home.screen.ts
    ├── login.screen.ts
    └── shop.screen.ts
```

Rationale for the dedicated folder (vs. side-by-side):

- `screens/` becomes pure intent (methods, navigation, waits). `locators/` becomes the UI contract — a single audit surface for accessibility-id debt.
- A reviewer focused on locator quality (or a dev backfilling `contentDescription`) browses one folder and sees every selector the suite makes assumptions about.
- Scales cleanly as the suite grows: when there are 15+ screens, the `screens/` folder isn't mixing two file types alphabetically.

The locators file exports ONE namespaced object marked `as const`:

```ts
// src/locators/login.locators.ts
export const LOGIN_LOCATORS = {
  emailField: '//android.widget.EditText[contains(@hint, "Email")]',
  passwordField: '//android.widget.EditText[contains(@hint, "Password")]',
  signInButton: '~Sign In',
  welcomeLabel: '~Welcome',
  errorBanner: 'android=new UiSelector().descriptionStartsWith("Error message")',
} as const
```

The screen file imports it via the relative path `../locators/<name>.locators`:

```ts
// src/screens/login.screen.ts
import { LOGIN_LOCATORS } from '../locators/login.locators'

private get emailField(): ChainablePromiseElement {
  return $(LOGIN_LOCATORS.emailField)
}
```

### Why a separate file (and not inline)

| Concern | Inline strings in `.screen.ts` | Dedicated `src/locators/<name>.locators.ts` |
|---|---|---|
| Locator debt visibility | scattered through methods, hard to audit | one folder = full inventory of "UI assumptions" the test makes |
| Refactor when dev adds `contentDescription` | grep across many files | edit one line in one file |
| Reviewer mental model | mix of intent and UI strings | "screens is intent, locators is UI contract" |
| File size | classes balloon as screens grow | each file stays under ~50 lines |
| Per-platform variants (future iOS) | hard | naturally extensible (`login.locators.android.ts` etc.) |

### Hard rules

- One `<name>.locators.ts` per `<name>.screen.ts`. No exceptions.
- The locators file lives in `src/locators/`, NOT in `src/screens/`.
- Export ONE object named `<NAME>_LOCATORS` in UPPER_SNAKE_CASE, with `as const`.
- Never export individual entries (no `export const EMAIL_FIELD = ...`). Use the namespace.
- Never inline a locator string in a `.screen.ts` method body or in a `.steps.ts` file.
- Comments above each entry explain non-obvious strategy (why XPath, why `descriptionContains`, etc.). Strategy choice itself follows the `appium-selectors` skill.

## File template

```ts
// src/locators/login.locators.ts
export const LOGIN_LOCATORS = {
  emailField: '//android.widget.EditText[contains(@hint, "Email")]',
  passwordField: '//android.widget.EditText[contains(@hint, "Password")]',
  signInButton: '~Sign In',
  welcomeLabel: '~Welcome',
  inlineError: '~loginInlineError',
} as const
```

```ts
// src/screens/login.screen.ts
import { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '@support/base.screen'
import { HomeScreen } from '@screens/home.screen'
import { LOGIN_LOCATORS } from '../locators/login.locators'

export class LoginScreen extends BaseScreen {
  private get emailField(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.emailField)
  }

  private get passwordField(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.passwordField)
  }

  private get submitButton(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.signInButton)
  }

  private get inlineError(): ChainablePromiseElement {
    return $(LOGIN_LOCATORS.inlineError)
  }

  async isLoaded(): Promise<boolean> {
    return this.emailField.isDisplayed()
  }

  async waitUntilLoaded(timeoutMs = 10_000): Promise<void> {
    await this.emailField.waitForDisplayed({ timeout: timeoutMs })
  }

  async login(email: string, password: string): Promise<HomeScreen> {
    await this.waitUntilLoaded()
    await this.emailField.setValue(email)
    await this.passwordField.setValue(password)
    await this.submitButton.click()
    const home = new HomeScreen()
    await home.waitUntilLoaded()
    return home
  }

  async getInlineErrorText(): Promise<string> {
    await this.inlineError.waitForDisplayed({ timeout: 5_000 })
    return this.inlineError.getText()
  }
}
```

## BaseScreen

```ts
// src/support/base.screen.ts
import { ChainablePromiseElement } from 'webdriverio'

export abstract class BaseScreen {
  protected async waitFor(
    el: ChainablePromiseElement,
    timeoutMs = 10_000,
  ): Promise<void> {
    await el.waitForDisplayed({ timeout: timeoutMs })
  }

  protected async scrollIntoView(
    selector: string,
    maxSwipes = 5,
  ): Promise<void> {
    await $(
      `android=new UiScrollable(new UiSelector().scrollable(true))` +
        `.scrollIntoView(${selector})`,
    )
    void maxSwipes
  }
}
```

## Navigation between screens

When a method causes a screen transition, it must return the next screen and wait for it to be loaded. Steps then never need to know about timing.

```ts
async tapCheckout(): Promise<CheckoutScreen> {
  await this.checkoutButton.click()
  const checkout = new CheckoutScreen()
  await checkout.waitUntilLoaded()
  return checkout
}
```

## Forbidden in Screen Objects

- `expect(...)` / `assert(...)` — assertions belong in steps.
- Reading `process.env` — that's the job of config.
- `await browser.pause(N)` — use explicit waits.
- Logic that branches on test data shape — keep methods focused on one user intent.
- Reusing one Screen Object across two real screens — split them.
- Methods that mix AAA phases (e.g. an Action that asserts, or a Setup that performs the action under test). Split them.
- Hard-coded `appPackage` / `appActivity` strings duplicated across files — centralize in `src/config/app.constants.ts`.
- Inlined locator strings in method bodies. Locators live in `<name>.locators.ts` and are accessed via the `<NAME>_LOCATORS` namespace import.

## When to add a new Screen Object

Create a new Screen Object when **any** of these is true:

- A new visible screen appears in the app.
- A modal/dialog has its own distinct locators and actions that 2+ tests need.
- An existing class crosses 200 lines or 8 methods.

Do NOT create one for every transient toast — those go into a small `support/toast.helper.ts`.

## Verification before merging a new screen

- [ ] Files are `src/screens/<name>.screen.ts` AND `src/locators/<name>.locators.ts` (note the different folders).
- [ ] `<name>.locators.ts` exports a single `<NAME>_LOCATORS` object marked `as const`.
- [ ] `<name>.screen.ts` imports the namespace and uses it in every `private get`. No inline selector strings.
- [ ] Class extends `BaseScreen`.
- [ ] All locator strategies follow `appium-selectors` priority order. XPath entries are commented and listed in `LOCATOR_DEBT.md`.
- [ ] `isLoaded()` and `waitUntilLoaded()` exist.
- [ ] No assertions, no logs, no pauses, no env reads.
- [ ] Navigation methods return the destination screen.
- [ ] At least one Cucumber step uses the new screen.

## Related skills

- `appium-selectors` — how to pick the locator strings inside the getters.
- `appium-write-test` — how step definitions consume Screen Objects.
