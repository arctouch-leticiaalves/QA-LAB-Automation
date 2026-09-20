export const SLIDER_RANGE_LOCATORS = {
  backButton: '~Back',

  sliderRangeTitle:
    'android=new UiSelector().description("Slider & Range").clickable(false)',

  instructionalHint:
    'android=new UiSelector().descriptionContains("Instructional hint")',

  continuousSlider:
    'android=new UiSelector().descriptionContains("Continuous slider, value")',

  continuousSeekBar:
    'android=new UiSelector().descriptionContains("Continuous Slider").childSelector(new UiSelector().className("android.widget.SeekBar"))',

  discreteSlider:
    'android=new UiSelector().descriptionContains("Discrete slider, value")',

  discreteSeekBar:
    'android=new UiSelector().descriptionContains("Discrete Slider").childSelector(new UiSelector().className("android.widget.SeekBar"))',

  rangeSlider:
    'android=new UiSelector().descriptionContains("Range slider, from")',

  rangeMinSeekBar:
    'android=new UiSelector().className("android.widget.SeekBar").instance(2)',

  rangeMaxSeekBar:
    'android=new UiSelector().className("android.widget.SeekBar").instance(3)',
} as const
