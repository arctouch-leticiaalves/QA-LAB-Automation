export const PINCH_TO_ZOOM_LOCATORS = {
  pinchToZoomTitle:
    'android=new UiSelector().description("Pinch to Zoom").clickable(false)',

  zoomLevel: 'android=new UiSelector().descriptionContains("Zoom level")',

  resetZoomButton: 'android=new UiSelector().description("Reset zoom")',

  dismissHintButton:
    'android=new UiSelector().descriptionContains("Dismiss hint")',
} as const
