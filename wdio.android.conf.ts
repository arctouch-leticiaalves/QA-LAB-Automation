import { resolve } from 'node:path'
import { baseConfig } from './wdio.conf'
import { androidCaps, appiumHost, appiumPort } from './src/config/capabilities'

process.env.APPIUM_HOME = process.env.APPIUM_HOME ?? resolve(__dirname, '.appium')

export const config: WebdriverIO.Config = {
  ...baseConfig,
  port: appiumPort,
  hostname: appiumHost,
  path: '/',

  capabilities: androidCaps,

  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: appiumHost,
          port: appiumPort,
          basePath: '/',
          relaxedSecurity: true,
          logLevel: 'info',
          allowInsecure: ['adb_shell'],
        },
        logPath: resolve(__dirname, 'test-results', 'logs'),
      },
    ],
  ],
}
