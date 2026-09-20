import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { DROPDOWN_MENUS_LOCATORS } from '../locators/dropdown-menus.locators'

const SORT_OPTION_LABELS: Record<string, string> = {
  'Name A-Z': 'Name (A-Z)',
  'Name Z-A': 'Name (Z-A)',
  'Price Low to High': 'Price (Low to High)',
  'Price High to Low': 'Price (High to Low)',
  'Newest First': 'Newest First',
}

export class DropdownMenusScreen extends BaseScreen {
  private get dropdownMenusTitle(): ChainablePromiseElement {
    return $(DROPDOWN_MENUS_LOCATORS.dropdownMenusTitle)
  }

  private get countryDropdown(): ChainablePromiseElement {
    return $(DROPDOWN_MENUS_LOCATORS.countryDropdown)
  }

  private get sortPopup(): ChainablePromiseElement {
    return $(DROPDOWN_MENUS_LOCATORS.sortPopup)
  }

  private get countryAutocomplete(): ChainablePromiseElement {
    return $(DROPDOWN_MENUS_LOCATORS.countryAutocomplete)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.dropdownMenusTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.countryDropdown.waitForDisplayed({ timeout: timeoutMs })
    await this.sortPopup.waitForDisplayed({ timeout: timeoutMs })
    await this.countryAutocomplete.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.dropdownMenusTitle.isDisplayed().catch(() => false)
  }

  async isCountryDropdownEmpty(): Promise<boolean> {
    return $(DROPDOWN_MENUS_LOCATORS.countryDropdownNoneSelected)
      .isDisplayed()
      .catch(() => false)
  }

  async isSortPopupEmpty(): Promise<boolean> {
    return $(DROPDOWN_MENUS_LOCATORS.sortPopupNoneSelected)
      .isDisplayed()
      .catch(() => false)
  }

  async isCountryAutocompleteEmpty(): Promise<boolean> {
    const hint =
      (await this.countryAutocomplete.getAttribute('hint').catch(() => '')) ??
      ''
    return !hint.includes('Selected:')
  }

  async selectCountryFromDropdown(country: string): Promise<void> {
    await this.countryDropdown.click()
    const option = $(DROPDOWN_MENUS_LOCATORS.countryOption(country))
    await option.waitForDisplayed({ timeout: 5_000 })
    await option.click()
    await this.waitForCountryDropdownSelected(country)
  }

  async selectSortOption(optionKey: string): Promise<void> {
    const optionLabel = this.resolveSortLabel(optionKey)
    await this.openSortPopupMenu()
    const option = $(DROPDOWN_MENUS_LOCATORS.sortOption(optionLabel))
    await option.waitForDisplayed({ timeout: 5_000 })
    await option.click()
    await this.waitForSortPopupSelected(optionLabel)
  }

  async searchAndSelectCountry(query: string, country: string): Promise<void> {
    await this.waitFor(this.countryAutocomplete, 5_000)
    await this.fillTextField(this.countryAutocomplete, query)
    try {
      if (await driver.isKeyboardShown()) {
        /* keep keyboard — suggestions may depend on focus */
      }
    } catch {
      /* ignore */
    }
    const suggestion = $(DROPDOWN_MENUS_LOCATORS.autocompleteSuggestion(country))
    await suggestion.waitForDisplayed({ timeout: 5_000 })
    await suggestion.click()
    await this.hideKeyboardIfShown()
    await this.waitForCountryAutocompleteSelected(country)
  }

  async isCountryDropdownSelected(country: string): Promise<boolean> {
    return $(DROPDOWN_MENUS_LOCATORS.countryDropdownSelected(country))
      .isDisplayed()
      .catch(() => false)
  }

  async isSortPopupSelected(optionKey: string): Promise<boolean> {
    const optionLabel = this.resolveSortLabel(optionKey)
    const desc =
      (await this.sortPopup.getAttribute('content-desc').catch(() => '')) ?? ''
    return desc.includes(optionLabel) && !desc.includes('No sort selected')
  }

  async isCountryAutocompleteSelected(country: string): Promise<boolean> {
    return $(DROPDOWN_MENUS_LOCATORS.countryAutocompleteSelected(country))
      .isDisplayed()
      .catch(() => false)
  }

  private resolveSortLabel(optionKey: string): string {
    const label = SORT_OPTION_LABELS[optionKey]
    if (!label) {
      throw new Error(`Unknown sort option key: "${optionKey}"`)
    }
    return label
  }

  private async openSortPopupMenu(): Promise<void> {
    await this.waitFor(this.sortPopup, 5_000)
    const location = await this.sortPopup.getLocation()
    const size = await this.sortPopup.getSize()
    // The popup is opened by the trailing menu icon, not the card center.
    await driver.execute('mobile: clickGesture', {
      x: Math.round(location.x + size.width - 80),
      y: Math.round(location.y + size.height / 2),
    })
  }

  private async waitForCountryDropdownSelected(country: string): Promise<void> {
    await browser.waitUntil(
      async () => this.isCountryDropdownSelected(country),
      {
        timeout: 5_000,
        timeoutMsg: `Country dropdown did not show ${country} selected`,
      },
    )
  }

  private async waitForSortPopupSelected(optionLabel: string): Promise<void> {
    await browser.waitUntil(
      async () => {
        const desc =
          (await this.sortPopup.getAttribute('content-desc').catch(() => '')) ??
          ''
        return desc.includes(optionLabel) && !desc.includes('No sort selected')
      },
      {
        timeout: 5_000,
        timeoutMsg: `Sort popup did not show ${optionLabel} selected`,
      },
    )
  }

  private async waitForCountryAutocompleteSelected(
    country: string,
  ): Promise<void> {
    await browser.waitUntil(
      async () => this.isCountryAutocompleteSelected(country),
      {
        timeout: 5_000,
        timeoutMsg: `Country autocomplete did not show ${country} selected`,
      },
    )
  }
}
