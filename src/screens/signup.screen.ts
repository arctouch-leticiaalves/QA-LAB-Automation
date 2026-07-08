import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { COMMON_LOCATORS } from '../locators/common.locators'
import { SIGNUP_LOCATORS } from '../locators/signup.locators'
import { SignUpData } from '@support/test-data/signup'

export class SignupScreen extends BaseScreen {
    private get createAccountTitle(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.titleLabel)
    }
    private get emailField(): ChainablePromiseElement {
        return $(COMMON_LOCATORS.emailField)
    }

    private get passwordField(): ChainablePromiseElement {
        return $(COMMON_LOCATORS.passwordField)
    }
    private get fullNameField(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.fullNameField)
    }
    private get phoneField(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.phoneField)
    }
    private get confirmPasswordField(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.confirmPasswordField)
    }
    private get termsCheckbox(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.termsCheckbox)
    }
    private get createAccountButton(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.createAccountButton)
    }
    private get signInLink(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.signInLink)
    }
    private get successToast(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.successToast)
    }
    private get fieldError(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.fieldError)
    }
    private get errorBanner(): ChainablePromiseElement {
        return $(SIGNUP_LOCATORS.errorBanner)
    }

    async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
        await this.createAccountTitle.waitForDisplayed({ timeout: timeoutMs })
    }

    async submit(data: SignUpData, options: { acceptTerms: boolean }): Promise<void> {
        await this.fillTextField(this.fullNameField, data.name)
        await this.fillTextField(this.emailField, data.email)
        await this.fillTextField(this.phoneField, data.phone)
        await this.fillTextField(this.passwordField, data.password)
        await this.hideKeyboardIfShown()
        await this.fillTextField(this.confirmPasswordField, data.confirm)
        await this.hideKeyboardIfShown()
        if (options.acceptTerms) {
            await this.termsCheckbox.click()
        }
        await this.createAccountButton.click()
    }
    async isLoaded(): Promise<boolean> {
        return this.createAccountTitle.isDisplayed()
    }

    async tapSignInLink(): Promise<import('./login.screen').LoginScreen> {
        await this.signInLink.click()
        const { LoginScreen } = await import('./login.screen')
        const login = new LoginScreen()
        await login.waitUntilLoaded()
        return login
    }

    async hasErrorBanner(timeoutMs = 5_000): Promise<boolean> {
        try {
            await Promise.race([
                this.fieldError.waitForDisplayed({ timeout: timeoutMs }),
                this.errorBanner.waitForDisplayed({ timeout: timeoutMs }),
            ])
            return true
        } catch {
            return false
        }
    }
    async hasSuccessToast(timeoutMs = 3_000): Promise<boolean> {
        try {
            await this.successToast.waitForDisplayed({ timeout: timeoutMs })
            return true
        } catch {
            return false
        }
    }
}