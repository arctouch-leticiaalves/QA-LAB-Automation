import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { PROFILE_LOCATORS } from '../locators/profile.locators'
import { EditProfileScreen } from './edit-profile.screen'

export class ProfileScreen extends BaseScreen {
  private get profileTab(): ChainablePromiseElement {
    return $(PROFILE_LOCATORS.profileTab)
  }

  private get profileTitle(): ChainablePromiseElement {
    return $(PROFILE_LOCATORS.profileTitle)
  }

  private get editProfileButton(): ChainablePromiseElement {
    return $(PROFILE_LOCATORS.editProfileButton)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.profileTitle.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.profileTitle.isDisplayed().catch(() => false)
  }

  async openFromNavBar(): Promise<void> {
    await this.waitFor(this.profileTab, 5_000)
    await this.profileTab.click()
    await this.waitUntilLoaded()
  }

  async tapEditProfile(): Promise<EditProfileScreen> {
    await this.waitFor(this.editProfileButton, 5_000)
    await this.editProfileButton.click()
    const editProfile = new EditProfileScreen()
    await editProfile.waitUntilLoaded()
    return editProfile
  }
}
