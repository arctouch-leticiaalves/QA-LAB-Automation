import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { SLIDER_RANGE_LOCATORS } from '../locators/slider-range.locators'

const DISCRETE_MIN = 1
const DISCRETE_MAX = 5
const SLIDER_MIN = 0
const SLIDER_MAX = 100
const BINARY_SEARCH_ITERATIONS = 10

export class SliderRangeScreen extends BaseScreen {
  private get sliderRangeTitle(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.sliderRangeTitle)
  }

  private get continuousSlider(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.continuousSlider)
  }

  private get continuousSeekBar(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.continuousSeekBar)
  }

  private get discreteSlider(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.discreteSlider)
  }

  private get discreteSeekBar(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.discreteSeekBar)
  }

  private get rangeSlider(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.rangeSlider)
  }

  private get rangeMinSeekBar(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.rangeMinSeekBar)
  }

  private get rangeMaxSeekBar(): ChainablePromiseElement {
    return $(SLIDER_RANGE_LOCATORS.rangeMaxSeekBar)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.sliderRangeTitle.waitForDisplayed({ timeout: timeoutMs })
    await this.continuousSlider.waitForDisplayed({ timeout: timeoutMs })
    await this.discreteSlider.waitForDisplayed({ timeout: timeoutMs })
    await this.rangeSlider.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.sliderRangeTitle.isDisplayed().catch(() => false)
  }

  async getContinuousSliderValue(): Promise<number> {
    return this.parseSliderValue(
      this.continuousSlider,
      /Continuous slider, value (\d+)/u,
    )
  }

  async getDiscreteSliderValue(): Promise<number> {
    return this.parseSliderValue(
      this.discreteSlider,
      /Discrete slider, value (\d+)/u,
    )
  }

  async getRangeSliderValues(): Promise<{ min: number; max: number }> {
    await this.rangeSlider.waitForDisplayed({ timeout: 5_000 })
    const desc = (await this.rangeSlider.getAttribute('content-desc')) ?? ''
    const match = desc.match(/Range slider, from (\d+) to (\d+)/u)
    if (!match) {
      throw new Error(`Could not parse range slider value from: "${desc}"`)
    }
    return { min: Number(match[1]), max: Number(match[2]) }
  }

  async setContinuousSliderTo(value: number): Promise<void> {
    await this.setSeekBarValue(this.continuousSeekBar, value, () =>
      this.getContinuousSliderValue(),
    )
    await this.waitForSliderValue(
      this.continuousSlider,
      value,
      /Continuous slider, value (\d+)/u,
    )
  }

  async setDiscreteSliderTo(value: number): Promise<void> {
    await this.tapSeekBarAtPercent(
      this.discreteSeekBar,
      this.discreteValueToPercent(value),
    )
    await this.waitForSliderValue(
      this.discreteSlider,
      value,
      /Discrete slider, value (\d+)/u,
    )
  }

  async setRangeSlider(min: number, max: number): Promise<void> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Range slider, from")',
    )

    const values = await this.getRangeSliderValues()
    if (values.max !== max) {
      await this.binarySearchTapToValue(
        async () => (await this.getRangeSliderValues()).max,
        (percent) => this.tapRangeTrackAtPercent(percent, 'max'),
        max,
      )
    }

    const afterMax = await this.getRangeSliderValues()
    if (afterMax.min !== min) {
      await this.setSeekBarValue(this.rangeMinSeekBar, min, async () =>
        (await this.getRangeSliderValues()).min,
      )
    }

    await this.waitForRangeValues(min, max)
  }

  private discreteValueToPercent(value: number): number {
    const clamped = Math.min(DISCRETE_MAX, Math.max(DISCRETE_MIN, value))
    return ((clamped - DISCRETE_MIN) / (DISCRETE_MAX - DISCRETE_MIN)) * 100
  }

  private async setSeekBarValue(
    seekBar: ChainablePromiseElement,
    target: number,
    readValue: () => Promise<number>,
  ): Promise<void> {
    const clampedTarget = Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, target))
    await this.waitFor(seekBar, 5_000)

    try {
      await seekBar.setValue(String(clampedTarget))
      await browser.pause(300)
      if ((await readValue()) === clampedTarget) return
    } catch {
      /* setValue unsupported — fall back to gestures */
    }

    const bracket = await this.binarySearchTapToValue(
      readValue,
      (percent) => this.tapSeekBarAtPercent(seekBar, percent),
      clampedTarget,
    )
    if (bracket.exact) return

    if (
      bracket.below !== null &&
      bracket.above !== null &&
      bracket.below.value !== bracket.above.value
    ) {
      const ratio =
        (clampedTarget - bracket.below.value) /
        (bracket.above.value - bracket.below.value)
      const interpolated =
        bracket.below.percent +
        ratio * (bracket.above.percent - bracket.below.percent)
      await this.tapSeekBarAtPercent(seekBar, interpolated)
      if ((await readValue()) === clampedTarget) return
    }

    const afterTap = await readValue()
    if (afterTap === clampedTarget) return

    await this.dragSeekBarToValue(seekBar, afterTap, clampedTarget)
  }

  private async binarySearchTapToValue(
    readValue: () => Promise<number>,
    tapAtPercent: (percent: number) => Promise<void>,
    target: number,
  ): Promise<{
    exact: boolean
    below: { percent: number; value: number } | null
    above: { percent: number; value: number } | null
  }> {
    const clampedTarget = Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, target))
    let low = SLIDER_MIN
    let high = SLIDER_MAX
    let below: { percent: number; value: number } | null = null
    let above: { percent: number; value: number } | null = null

    for (let attempt = 0; attempt < BINARY_SEARCH_ITERATIONS; attempt++) {
      const current = await readValue()
      if (current === clampedTarget) {
        return { exact: true, below, above }
      }

      const percent = Math.round((low + high) / 2)
      await tapAtPercent(percent)
      const after = await readValue()

      if (after === clampedTarget) {
        return { exact: true, below, above }
      }

      if (after < clampedTarget) {
        below = { percent, value: after }
        low = percent
      } else {
        above = { percent, value: after }
        high = percent
      }
    }

    return { exact: false, below, above }
  }

  private async dragSeekBarToValue(
    seekBar: ChainablePromiseElement,
    currentValue: number,
    targetValue: number,
  ): Promise<void> {
    await this.waitFor(seekBar, 5_000)
    const bounds = await this.getSeekBarBounds(seekBar)
    const start = this.valueToCoordinates(bounds, currentValue)
    const end = this.valueToCoordinates(bounds, targetValue)
    await this.performDrag(start.x, start.y, end.x, end.y)
  }

  private async performDrag(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): Promise<void> {
    if (startX === endX && startY === endY) return

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 250 },
          { type: 'pointerMove', duration: 600, x: endX, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ])
    await driver.releaseActions()
    await browser.pause(400)
  }

  private async parseSliderValue(
    slider: ChainablePromiseElement,
    pattern: RegExp,
  ): Promise<number> {
    await slider.waitForDisplayed({ timeout: 5_000 })
    const desc = (await slider.getAttribute('content-desc')) ?? ''
    const match = desc.match(pattern)
    if (!match) {
      throw new Error(`Could not parse slider value from: "${desc}"`)
    }
    return Number(match[1])
  }

  private async waitForSliderValue(
    slider: ChainablePromiseElement,
    expected: number,
    pattern: RegExp,
  ): Promise<void> {
    await browser.waitUntil(
      async () => {
        const desc = (await slider.getAttribute('content-desc')) ?? ''
        const match = desc.match(pattern)
        return match !== null && Number(match[1]) === expected
      },
      {
        timeout: 5_000,
        interval: 200,
        timeoutMsg: `Expected slider value ${expected}`,
      },
    )
  }

  private async waitForRangeValues(min: number, max: number): Promise<void> {
    await browser.waitUntil(
      async () => {
        const values = await this.getRangeSliderValues()
        return values.min === min && values.max === max
      },
      {
        timeout: 5_000,
        interval: 200,
        timeoutMsg: `Expected range slider values ${min} to ${max}`,
      },
    )
  }

  private async tapSeekBarAtPercent(
    seekBar: ChainablePromiseElement,
    percent: number,
  ): Promise<void> {
    await this.waitFor(seekBar, 5_000)
    const { x, y } = this.valueToCoordinates(
      await this.getSeekBarBounds(seekBar),
      percent,
    )
    await driver.execute('mobile: clickGesture', { x, y })
    await browser.pause(250)
  }

  private async tapRangeTrackAtPercent(
    percent: number,
    thumb: 'min' | 'max',
  ): Promise<void> {
    const thumbSeekBar =
      thumb === 'min' ? this.rangeMinSeekBar : this.rangeMaxSeekBar
    await this.waitFor(thumbSeekBar, 5_000)
    await this.waitFor(this.continuousSeekBar, 5_000)

    const trackBounds = await this.getSeekBarBounds(this.continuousSeekBar)
    const thumbBounds = await this.getSeekBarBounds(thumbSeekBar)
    const { x } = this.valueToCoordinates(trackBounds, percent)

    await driver.execute('mobile: clickGesture', {
      x,
      y: Math.round(thumbBounds.y + thumbBounds.height / 2),
    })
    await browser.pause(250)
  }

  private async getSeekBarBounds(
    seekBar: ChainablePromiseElement,
  ): Promise<{ x: number; y: number; width: number; height: number }> {
    const location = await seekBar.getLocation()
    const size = await seekBar.getSize()
    return {
      x: location.x,
      y: location.y,
      width: size.width,
      height: size.height,
    }
  }

  private valueToCoordinates(
    bounds: { x: number; y: number; width: number; height: number },
    value: number,
  ): { x: number; y: number } {
    const clamped = Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, value))
    return {
      x: Math.round(bounds.x + bounds.width * (clamped / SLIDER_MAX)),
      y: Math.round(bounds.y + bounds.height / 2),
    }
  }
}
