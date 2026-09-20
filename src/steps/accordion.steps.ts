import { When, Then } from '@wdio/cucumber-framework'
import { ACCORDION_SECTIONS } from '../locators/accordion.locators'

When(/^the user opens the Accordion scenario$/, async function () {
  this.accordion = await this.additionalTests.openAccordion()
})

When(/^the user expands the What is this app section$/, async function () {
  await this.accordion.expandSection(ACCORDION_SECTIONS.whatIsThisApp)
})

When(/^the user collapses the What is this app section$/, async function () {
  await this.accordion.collapseSection(ACCORDION_SECTIONS.whatIsThisApp)
})

When(/^the user taps Expand All$/, async function () {
  await this.accordion.tapExpandAll()
})

When(/^the user taps Collapse All$/, async function () {
  await this.accordion.tapCollapseAll()
})

Then(/^the accordion screen should be displayed$/, async function () {
  expect(await this.accordion.isLoaded()).toBe(true)
})

Then(/^(\d+) of 5 sections should be expanded$/, async function (count: string) {
  expect(await this.accordion.getExpandedSectionCount()).toBe(Number(count))
})

Then(/^the Expand All button should be displayed$/, async function () {
  expect(await this.accordion.isExpandAllDisplayed()).toBe(true)
})

Then(/^the Collapse All button should be displayed$/, async function () {
  expect(await this.accordion.isCollapseAllDisplayed()).toBe(true)
})

Then(/^the What is this app section should be expanded$/, async function () {
  expect(
    await this.accordion.isSectionExpanded(ACCORDION_SECTIONS.whatIsThisApp),
  ).toBe(true)
})

Then(/^the What is this app section should be collapsed$/, async function () {
  expect(
    await this.accordion.isSectionCollapsed(ACCORDION_SECTIONS.whatIsThisApp),
  ).toBe(true)
})

Then(
  /^the What is this app section content should be displayed$/,
  async function () {
    expect(await this.accordion.isWhatIsThisAppContentDisplayed()).toBe(true)
  },
)
