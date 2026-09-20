import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { PROFILE_LOCATORS } from '../locators/profile.locators'
import { EditProfileScreen } from './edit-profile.screen'
import { OrdersScreen } from './orders.screen'
import { FavoritesScreen } from './favorites.screen'

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

  private get myOrdersButton(): ChainablePromiseElement {
    return $(PROFILE_LOCATORS.myOrdersButton)
  }

  private get myFavoritesButton(): ChainablePromiseElement {
    return $(PROFILE_LOCATORS.myFavoritesButton)
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

  async openMyOrders(): Promise<OrdersScreen> {
    await this.waitFor(this.myOrdersButton, 5_000)
    await this.myOrdersButton.click()
    const orders = new OrdersScreen()
    await orders.waitUntilLoaded()
    return orders
  }

  async openMyFavorites(): Promise<FavoritesScreen> {
    await this.waitFor(this.myFavoritesButton, 5_000)
    await this.myFavoritesButton.click()
    const favorites = new FavoritesScreen()
    await favorites.waitUntilLoaded()
    return favorites
  }
}
