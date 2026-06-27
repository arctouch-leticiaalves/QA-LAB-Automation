import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required env var: ${name}. Copy .env.example to .env and fill it in.`,
    )
  }
  return value
}

function optional(name: string, fallback: string): string {
  const value = process.env[name]
  return value && value.trim() !== '' ? value : fallback
}

function boolEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name]
  if (value === undefined || value === '') return fallback
  return value === 'true' || value === '1'
}

export const androidCaps: WebdriverIO.Capabilities[] = [
  {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:platformVersion': required('ANDROID_PLATFORM_VERSION'),
    'appium:deviceName': required('ANDROID_DEVICE_NAME'),
    'appium:udid': optional('ANDROID_UDID', ''),
    'appium:appPackage': required('ANDROID_APP_PACKAGE'),
    'appium:appActivity': required('ANDROID_APP_ACTIVITY'),
    'appium:appWaitActivity': optional('ANDROID_APP_WAIT_ACTIVITY', '*'),
    'appium:app': optional('ANDROID_APP_PATH', ''),
    'appium:noReset': boolEnv('ANDROID_NO_RESET', true),
    'appium:fullReset': false,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 240,
    'appium:adbExecTimeout': 60_000,
    'appium:uiautomator2ServerInstallTimeout': 120_000,
    'appium:disableWindowAnimation': true,
  } as unknown as WebdriverIO.Capabilities,
]

export const appiumHost = optional('APPIUM_HOST', '127.0.0.1')
export const appiumPort = Number.parseInt(optional('APPIUM_PORT', '4723'), 10)
