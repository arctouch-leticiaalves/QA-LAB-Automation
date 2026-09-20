import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { PROFILE_LOCATORS } from '../locators/profile.locators'

export class EditProfileScreen extends BaseScreen {
    private get backButton(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.backButton)
    }
    private get editProfileTitle(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.editProfileTitle)
    }
    private get saveButton(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.saveButton)
    }
    private get saveChangesButton(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.saveChangesButton)
    }
    private get fullNameField(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.fullNameField)
    }
    private get emailField(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.emailField)
    }
    private get phoneField(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.phoneField)
    }
    private get addressField(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.addressField)
    }
    private get cityField(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.cityField)
    }
    private get stateField(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.stateField)
    }
    private get zipCodeField(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.zipCodeField)
    }
    private get fieldError(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.fieldError)
    }
    private get requiredIndicator(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.requiredIndicator)
    }
    private get invalidEmailError(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.invalidEmailError)
    }
    private get discardDialogTitle(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.discardDialogTitle)
    }
    private get discardDialogMessage(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.discardDialogMessage)
    }
    private get discardDialogCancelButton(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.discardDialogCancelButton)
    }
    private get discardDialogDiscardButton(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.discardDialogDiscardButton)
    }
    private get successToast(): ChainablePromiseElement {
        return $(PROFILE_LOCATORS.successToast)
    }

    async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
        await this.editProfileTitle.waitForDisplayed({ timeout: timeoutMs })
    }

    async isLoaded(): Promise<boolean> {
        return this.editProfileTitle.isDisplayed().catch(() => false)
    }

    async editProfileValidDetails(fullName: string, email: string, phone: string, address: string, city: string, state: string, zipCode: string ): Promise<void> {
        await this.fillTextField(this.fullNameField, fullName)
        await this.fillTextField(this.emailField, email)
        await this.fillTextField(this.phoneField, phone)
        await this.fillTextField(this.addressField, address)
        await this.fillTextField(this.cityField, city)
        await this.fillTextField(this.stateField, state)
        await this.fillTextField(this.zipCodeField, zipCode)
        await this.hideKeyboardIfShown()
        await this.saveChangesButton.click()
    }
    async editProfileRequiredFields(fullName: string, email: string): Promise<void> {
        await this.fillTextField(this.fullNameField, fullName)
        await this.fillTextField(this.emailField, email)
        await this.fillTextField(this.phoneField, '')
        await this.fillTextField(this.addressField, '')
        await this.fillTextField(this.cityField, '')
        await this.fillTextField(this.stateField, '')
        await this.fillTextField(this.zipCodeField, '')
        await this.hideKeyboardIfShown()
        await this.saveChangesButton.click()
    }
    async hasSuccessToast(timeoutMs = 5_000): Promise<boolean> {
        return this.successToast
        .waitForDisplayed({ timeout: timeoutMs})
        .then(() => true)
        .catch(() => false)
    }
    async hasRequiredIndicator(timeoutMs = 5_000): Promise<boolean> {
        return this.requiredIndicator
        .waitForDisplayed({timeout: timeoutMs})
        .then(() => true)
        .catch(() => false)
    }
    async hasInvalidEmailError(timeoutMs = 5_000): Promise<boolean> {
        return this.invalidEmailError
        .waitForDisplayed({timeout: timeoutMs})
        .then(() => true)
        .catch(() => false)
    }
    async tapBack(): Promise<void> {
        await this.backButton.click()
    }
    async hasDiscardDialog(timeoutMs = 5_000): Promise<boolean> {
        return this.discardDialogTitle
        .waitForDisplayed({timeout: timeoutMs})
        .then(() => true)
        .catch(() => false) 
    }
    async changeFullNameWithoutSaving(fullName: string): Promise<void> {
        await this.fillTextField(this.fullNameField, fullName)
        await this.hideKeyboardIfShown()
      }

}
