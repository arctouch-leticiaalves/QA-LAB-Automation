export const ADDITIONAL_TESTS_LOCATORS = {
  backButton: '~Back',

  additionalTestsTitle:
    'android=new UiSelector().description("Additional Tests").clickable(false)',

  instructionalHint:
    'android=new UiSelector().descriptionContains("Instructional hint")',

  gestureTestsSection:
    'android=new UiSelector().description("GESTURE TESTS")',

  widgetTestsSection:
    'android=new UiSelector().description("WIDGET TESTS")',

  dragDropScenario:
    'android=new UiSelector().descriptionContains("Drag & Drop test scenario")',

  swipeableCarouselScenario:
    'android=new UiSelector().descriptionContains("Swipeable Carousel test scenario")',

  sliderRangeScenario:
    'android=new UiSelector().descriptionContains("Slider & Range test scenario")',

  pinchToZoomScenario:
    'android=new UiSelector().descriptionContains("Pinch to Zoom test scenario")',

  dateTimePickersScenario:
    'android=new UiSelector().descriptionContains("Date & Time Pickers test scenario")',

  dropdownMenusScenario:
    'android=new UiSelector().descriptionContains("Dropdown Menus test scenario")',

  accordionScenario:
    'android=new UiSelector().descriptionContains("Accordion test scenario")',

  tabBarScenario:
    'android=new UiSelector().descriptionContains("Tab Bar test scenario")',

  multiSelectScenario:
    'android=new UiSelector().descriptionContains("Multi-Select test scenario")',

  starRatingScenario:
    'android=new UiSelector().descriptionContains("Star Rating test scenario")',

  dialogWithInputScenario:
    'android=new UiSelector().descriptionContains("Dialog with Input test scenario")',

  timerStopwatchScenario:
    'android=new UiSelector().descriptionContains("Timer & Stopwatch test scenario")',

  progressBarScenario:
    'android=new UiSelector().descriptionContains("Progress Bar test scenario")',

  notificationsScenario:
    'android=new UiSelector().descriptionContains("Notifications test scenario")',

  otpPinInputScenario:
    'android=new UiSelector().descriptionContains("OTP / PIN Input test scenario")',
} as const
