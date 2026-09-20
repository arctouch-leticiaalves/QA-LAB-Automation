import type { ChainablePromiseElement } from 'webdriverio'
import { BaseScreen } from '../support/base.screen'
import { ADDITIONAL_TESTS_LOCATORS } from '../locators/additional-tests.locators'
import { DragDropScreen } from './drag-drop.screen'
import { SwipeableCarouselScreen } from './swipeable-carousel.screen'
import { PinchToZoomScreen } from './pinch-to-zoom.screen'
import { SliderRangeScreen } from './slider-range.screen'
import { DateTimePickersScreen } from './date-time-pickers.screen'
import { DropdownMenusScreen } from './dropdown-menus.screen'
import { AccordionScreen } from './accordion.screen'
import { TabBarScreen } from './tab-bar.screen'
import { MultiSelectScreen } from './multi-select.screen'
import { StarRatingScreen } from './star-rating.screen'
import { DialogWithInputScreen } from './dialog-with-input.screen'
import { TimerStopwatchScreen } from './timer-stopwatch.screen'
import { ProgressBarScreen } from './progress-bar.screen'
import { NotificationsScreen } from './notifications.screen'
import { OtpPinInputScreen } from './otp-pin-input.screen'

export class AdditionalTestsScreen extends BaseScreen {
  private get additionalTestsTitle(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.additionalTestsTitle)
  }

  private get gestureTestsSection(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.gestureTestsSection)
  }

  private get widgetTestsSection(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.widgetTestsSection)
  }

  private get dragDropScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.dragDropScenario)
  }

  private get swipeableCarouselScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.swipeableCarouselScenario)
  }

  private get pinchToZoomScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.pinchToZoomScenario)
  }

  private get sliderRangeScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.sliderRangeScenario)
  }

  private get dateTimePickersScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.dateTimePickersScenario)
  }

  private get dropdownMenusScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.dropdownMenusScenario)
  }

  private get accordionScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.accordionScenario)
  }

  private get tabBarScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.tabBarScenario)
  }

  private get multiSelectScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.multiSelectScenario)
  }

  private get starRatingScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.starRatingScenario)
  }

  private get dialogWithInputScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.dialogWithInputScenario)
  }

  private get timerStopwatchScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.timerStopwatchScenario)
  }

  private get progressBarScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.progressBarScenario)
  }

  private get notificationsScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.notificationsScenario)
  }

  private get otpPinInputScenario(): ChainablePromiseElement {
    return $(ADDITIONAL_TESTS_LOCATORS.otpPinInputScenario)
  }

  async waitUntilLoaded(timeoutMs = 15_000): Promise<void> {
    await this.additionalTestsTitle.waitForDisplayed({ timeout: timeoutMs })
  }

  async isLoaded(): Promise<boolean> {
    return this.additionalTestsTitle.isDisplayed().catch(() => false)
  }

  async isGestureSectionVisible(): Promise<boolean> {
    return this.gestureTestsSection.isDisplayed().catch(() => false)
  }

  async isWidgetSectionVisible(): Promise<boolean> {
    return this.widgetTestsSection.isDisplayed().catch(() => false)
  }

  async openDragDrop(): Promise<DragDropScreen> {
    await this.waitFor(this.dragDropScenario, 5_000)
    await this.dragDropScenario.click()
    const dragDrop = new DragDropScreen()
    await dragDrop.waitUntilLoaded()
    return dragDrop
  }

  async openSwipeableCarousel(): Promise<SwipeableCarouselScreen> {
    await this.waitFor(this.swipeableCarouselScenario, 5_000)
    await this.swipeableCarouselScenario.click()
    const swipeableCarousel = new SwipeableCarouselScreen()
    await swipeableCarousel.waitUntilLoaded()
    return swipeableCarousel
  }

  async openPinchToZoom(): Promise<PinchToZoomScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Pinch to Zoom test scenario")',
    )
    await this.waitFor(this.pinchToZoomScenario, 5_000)
    await this.pinchToZoomScenario.click()
    const pinchToZoom = new PinchToZoomScreen()
    await pinchToZoom.waitUntilLoaded()
    return pinchToZoom
  }

  async openSliderRange(): Promise<SliderRangeScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Slider & Range test scenario")',
    )
    await this.waitFor(this.sliderRangeScenario, 5_000)
    await this.sliderRangeScenario.click()
    const sliderRange = new SliderRangeScreen()
    await sliderRange.waitUntilLoaded()
    return sliderRange
  }

  async openDateTimePickers(): Promise<DateTimePickersScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Date & Time Pickers test scenario")',
    )
    await this.waitFor(this.dateTimePickersScenario, 5_000)
    await this.dateTimePickersScenario.click()
    const dateTimePickers = new DateTimePickersScreen()
    await dateTimePickers.waitUntilLoaded()
    return dateTimePickers
  }

  async openDropdownMenus(): Promise<DropdownMenusScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Dropdown Menus test scenario")',
    )
    await this.waitFor(this.dropdownMenusScenario, 5_000)
    await this.dropdownMenusScenario.click()
    const dropdownMenus = new DropdownMenusScreen()
    await dropdownMenus.waitUntilLoaded()
    return dropdownMenus
  }

  async openAccordion(): Promise<AccordionScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Accordion test scenario")',
    )
    await this.waitFor(this.accordionScenario, 5_000)
    await this.accordionScenario.click()
    const accordion = new AccordionScreen()
    await accordion.waitUntilLoaded()
    return accordion
  }

  async openTabBar(): Promise<TabBarScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Tab Bar test scenario")',
    )
    await this.waitFor(this.tabBarScenario, 5_000)
    await this.tabBarScenario.click()
    const tabBar = new TabBarScreen()
    await tabBar.waitUntilLoaded()
    return tabBar
  }

  async openMultiSelect(): Promise<MultiSelectScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Multi-Select test scenario")',
    )
    await this.waitFor(this.multiSelectScenario, 5_000)
    await this.multiSelectScenario.click()
    const multiSelect = new MultiSelectScreen()
    await multiSelect.waitUntilLoaded()
    return multiSelect
  }

  async openStarRating(): Promise<StarRatingScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Star Rating test scenario")',
    )
    await this.waitFor(this.starRatingScenario, 5_000)
    await this.starRatingScenario.click()
    const starRating = new StarRatingScreen()
    await starRating.waitUntilLoaded()
    return starRating
  }

  async openDialogWithInput(): Promise<DialogWithInputScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Dialog with Input test scenario")',
    )
    await this.waitFor(this.dialogWithInputScenario, 5_000)
    await this.dialogWithInputScenario.click()
    const dialogWithInput = new DialogWithInputScreen()
    await dialogWithInput.waitUntilLoaded()
    return dialogWithInput
  }

  async openTimerStopwatch(): Promise<TimerStopwatchScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Timer & Stopwatch test scenario")',
    )
    await this.waitFor(this.timerStopwatchScenario, 5_000)
    await this.timerStopwatchScenario.click()
    const timerStopwatch = new TimerStopwatchScreen()
    await timerStopwatch.waitUntilLoaded()
    return timerStopwatch
  }

  async openProgressBar(): Promise<ProgressBarScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Progress Bar test scenario")',
    )
    await this.waitFor(this.progressBarScenario, 5_000)
    await this.progressBarScenario.click()
    const progressBar = new ProgressBarScreen()
    await progressBar.waitUntilLoaded()
    return progressBar
  }

  async openNotifications(): Promise<NotificationsScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("Notifications test scenario")',
    )
    await this.waitFor(this.notificationsScenario, 5_000)
    await this.notificationsScenario.click()
    const notifications = new NotificationsScreen()
    await notifications.waitUntilLoaded()
    return notifications
  }

  async openOtpPinInput(): Promise<OtpPinInputScreen> {
    await this.scrollIntoView(
      'new UiSelector().descriptionContains("OTP / PIN Input test scenario")',
    )
    await this.waitFor(this.otpPinInputScenario, 5_000)
    await this.otpPinInputScenario.click()
    const otpPinInput = new OtpPinInputScreen()
    await otpPinInput.waitUntilLoaded()
    return otpPinInput
  }
}
