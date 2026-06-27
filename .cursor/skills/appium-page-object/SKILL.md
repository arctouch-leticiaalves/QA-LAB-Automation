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
4. Locators are `private readonly` getters returning `ChainablePromiseElement`. They are NEVER exported.
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

## File template

```ts
// src/screens/login.screen.ts
import { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '@support/base.screen'
import { HomeScreen } from '@screens/home.screen'

export class LoginScreen extends BaseScreen {
  private get emailField(): ChainablePromiseElement {
    return $('~emailField')
  }

  private get passwordField(): ChainablePromiseElement {
    return $('~passwordField')
  }

  private get submitButton(): ChainablePromiseElement {
    return $('~loginSubmit')
  }

  private get inlineError(): ChainablePromiseElement {
    return $('~loginInlineError')
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

## When to add a new Screen Object

Create a new Screen Object when **any** of these is true:

- A new visible screen appears in the app.
- A modal/dialog has its own distinct locators and actions that 2+ tests need.
- An existing class crosses 200 lines or 8 methods.

Do NOT create one for every transient toast — those go into a small `support/toast.helper.ts`.

## Verification before merging a new screen

- [ ] File is `src/screens/<name>.screen.ts`.
- [ ] Class extends `BaseScreen`.
- [ ] All locators are private and follow `appium-selectors` priority order.
- [ ] `isLoaded()` and `waitUntilLoaded()` exist.
- [ ] No assertions, no logs, no pauses, no env reads.
- [ ] Navigation methods return the destination screen.
- [ ] At least one Cucumber step uses the new screen.

## Related skills

- `appium-selectors` — how to pick the locator strings inside the getters.
- `appium-write-test` — how step definitions consume Screen Objects.
