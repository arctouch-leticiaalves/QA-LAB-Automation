import { Given, When, Then } from '@wdio/cucumber-framework'
import { AppActions } from '../support/app.actions'
import { LoginScreen } from '../screens/login.screen'
import { ShopScreen } from '../screens/shop.screen'
import { ProfileScreen } from '../screens/profile.screen'
import { EditProfileScreen } from '../screens/edit-profile.screen'
import { profileData } from '../support/test-data/profile'

const app = new AppActions()

Given(/^the user is on the edit profile screen$/, async function () {
  await app.clearData()
  await app.launch()

  this.login = new LoginScreen()
  await this.login.waitUntilLoaded()
  await this.login.submitForm('testing@arctouch.com', 'QA1234')

  this.shop = new ShopScreen()
  await this.shop.waitUntilLoaded()

  this.profile = new ProfileScreen()
  await this.profile.openFromNavBar()
  this.editProfile = await this.profile.tapEditProfile()
  this.editProfile = new EditProfileScreen()
})

When(/^the user updates the profile with valid details$/, async function () {
  const data = profileData.valid()
  await this.editProfile.editProfileValidDetails(
    data.fullName,
    data.email,
    data.phone,
    data.address,
    data.city,
    data.state,
    data.zipCode,
  )
})

Then(/^a profile success message must be displayed$/, async function () {
    expect(await this.editProfile.hasSuccessToast()).toBe(true)
})

When(/^the user updates the profile with valid required fields only$/, async function () {
    const data = profileData.valid()
    await this.editProfile.editProfileRequiredFields(
      data.fullName,
      data.email
    )
})
When(/^the user submits the edit profile form with (.+)$/, async function (caseDesc: string) {
    const data = profileData.forNegativeCase(caseDesc.trim())
    await this.editProfile.editProfileValidDetails(
      data.fullName,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.state,
      data.zipCode,
    )
  })

Then(/^the edit profile screen should still be displayed$/, async function () {
    expect(await this.editProfile.isLoaded()).toBe(true)
})

Then(/^a (required|field) error indicator should be visible$/, async function (errorType: string) {
  if (errorType === 'required') {
    expect(await this.editProfile.hasRequiredIndicator()).toBe(true)
  } else {
    expect(await this.editProfile.hasInvalidEmailError()).toBe(true)
  }
})

When(/^the user makes an unsaved change to the profile$/, async function () {
    const data = profileData.valid()
    await this.editProfile.changeFullNameWithoutSaving(
      data.fullName
    )
})
When(/^the user taps Back$/, async function () {
    await this.editProfile.tapBack()
  })
  
Then(/^a discard changes confirmation dialog should be displayed$/, async function () {
    expect(await this.editProfile.hasDiscardDialog()).toBe(true)
  })