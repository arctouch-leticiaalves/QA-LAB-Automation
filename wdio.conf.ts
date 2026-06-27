import 'dotenv/config'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const resultsDir = resolve(__dirname, 'test-results')
mkdirSync(resolve(resultsDir, 'allure-results'), { recursive: true })
mkdirSync(resolve(resultsDir, 'screenshots'), { recursive: true })
mkdirSync(resolve(resultsDir, 'logs'), { recursive: true })

export const baseConfig: Omit<WebdriverIO.Config, 'capabilities'> = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  specs: ['./features/**/*.feature'],
  exclude: [],

  maxInstances: 1,

  logLevel: 'info',
  outputDir: resolve(resultsDir, 'logs'),
  bail: 0,
  baseUrl: '',
  waitforTimeout: 15_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 2,

  specFileRetries: 1,
  specFileRetriesDelay: 5,
  specFileRetriesDeferred: true,

  framework: 'cucumber',

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: resolve(resultsDir, 'allure-results'),
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true,
      },
    ],
  ],

  cucumberOpts: {
    require: ['./src/steps/**/*.ts', './src/support/**/*.ts'],
    requireModule: ['tsconfig-paths/register'],
    backtrace: false,
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: true,
    tags: '@android',
    timeout: 120_000,
    ignoreUndefinedDefinitions: false,
  },

  afterStep: async function (_step, _scenario, result) {
    if (!result.passed) {
      try {
        const ts = new Date().toISOString().replace(/[:.]/g, '-')
        const file = resolve(resultsDir, 'screenshots', `failure-${ts}.png`)
        await browser.saveScreenshot(file)
      } catch {
        /* ignore */
      }
    }
  },
}
