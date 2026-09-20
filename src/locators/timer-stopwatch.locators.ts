export const TIMER_STOPWATCH_LOCATORS = {
  timerStopwatchTitle:
    'android=new UiSelector().description("Timer & Stopwatch").clickable(false)',

  elapsedTime:
    'android=new UiSelector().descriptionContains("Elapsed time:")',

  readyStatus: 'android=new UiSelector().description("Ready")',
  pausedStatus: 'android=new UiSelector().description("Paused")',
  runningStatus: 'android=new UiSelector().description("Running")',

  // Semantics label stays "Start button" even while the icon shows Pause.
  centerControl: 'android=new UiSelector().description("Start button")',

  resetFabButton:
    '//android.widget.Button[@content-desc="Reset" and @enabled="true"]',
} as const
