import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { SignupScreen } from '../screens/signup.screen'
import { signUpData } from '../support/test-data/signup'

const app = new AppActions()

Given(/^the user is on the sign up screen$/, async function () {
    await app.terminate()
    await app.launch()
    this.login = new LoginScreen()
    await this.login.waitUntilLoaded()
    this.signup = await this.login.tapSignUpLink()

})

When(/^the user creates an account with valid details$/, async function () {
    const data = signUpData.valid()
    await this.signup.submit(data, { acceptTerms: true })
})

Then(/^the user should be navigated to the login screen$/, async function () {
    await this.login.waitUntilLoaded()
})

Then(/^a success toast message must be displayed$/, async function () {
    expect(await this.signup.hasSuccessToast()).toBe(true)
})

When(/^the user creates an account with valid details and no phone$/, async function () {
    const data = signUpData.validWithoutPhone()
    await this.signup.submit(data, { acceptTerms: true })
})

When(/^the user submits the sign up form with (.+)$/, async function (caseDesc: string) {
    const { data, acceptTerms} = signUpData.forNegativeCase(caseDesc)
    await this.signup.submit(data, { acceptTerms })
})

When(/^the user taps the Sign In link$/, async function () {
    this.login = await this.signup.tapSignInLink()
})

Then(/^the sign up screen should still be displayed$/, async function () {
    await this.signup.waitUntilLoaded()
})

Then(/^a sign up error indicator should be visible$/, async function () {
    expect(await this.signup.hasErrorBanner()).toBe(true)
})
