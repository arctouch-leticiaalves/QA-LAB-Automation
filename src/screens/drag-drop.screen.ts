import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { DRAG_DROP_LOCATORS } from '../locators/drag-drop.locators'

const DEFAULT_ORDER =
  'Item 1 → Item 2 → Item 3 → Item 4 → Item 5 → Item 6 → Item 7 → Item 8'

const ITEM_COUNT = 8

export class DragDropScreen extends BaseScreen {
  private get dragDropTitle(): ChainablePromiseElement {
    return $(DRAG_DROP_LOCATORS.dragDropTitle)
  }

  private get orderDisplay(): ChainablePromiseElement {
    return $(DRAG_DROP_LOCATORS.orderDisplay)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.dragDropTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.orderDisplay.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.dragDropTitle.isDisplayed().catch(() => false)
  }

  async getDraggableItemCount(): Promise<number> {
    const items = await $$(DRAG_DROP_LOCATORS.draggableItems)
    return items.length
  }

  getExpectedItemCount(): number {
    return ITEM_COUNT
  }

  async getOrderDisplayText(): Promise<string> {
    await this.orderDisplay.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.orderDisplay.getAttribute('content-desc')) ?? ''
    const orderLine =
      desc
        .split('\n')
        .find((line) => line.startsWith('Order:')) ?? desc
    return orderLine.replace(/^Order:\s*/u, '').trim()
  }

  async hasDefaultOrder(): Promise<boolean> {
    const order = await this.getOrderDisplayText()
    return order === DEFAULT_ORDER
  }

  async isItemBefore(firstItem: string, secondItem: string): Promise<boolean> {
    const order = await this.getOrderDisplayText()
    const items = order.split('→').map((item) => item.trim())
    const firstIndex = items.indexOf(firstItem)
    const secondIndex = items.indexOf(secondItem)
    return firstIndex >= 0 && secondIndex >= 0 && firstIndex < secondIndex
  }

  async dragItemBelowItem(
    sourceItemName: string,
    anchorItemName: string,
  ): Promise<void> {
    const source = $(DRAG_DROP_LOCATORS.draggableItem(sourceItemName))
    const anchor = $(DRAG_DROP_LOCATORS.draggableItem(anchorItemName))
    await this.waitFor(source, 5_000)
    await this.waitFor(anchor, 5_000)

    const sourceLoc = await source.getLocation()
    const sourceSize = await source.getSize()
    const anchorLoc = await anchor.getLocation()
    const anchorSize = await anchor.getSize()

    const startX = Math.round(sourceLoc.x + sourceSize.width / 2)
    const startY = Math.round(sourceLoc.y + sourceSize.height / 2)
    const endX = Math.round(anchorLoc.x + anchorSize.width / 2)
    const endY = Math.round(anchorLoc.y + anchorSize.height + anchorSize.height / 2)

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 1_200 },
          { type: 'pointerMove', duration: 1_000, x: endX, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ])
    await driver.releaseActions()
    await browser.pause(500)
  }
}
