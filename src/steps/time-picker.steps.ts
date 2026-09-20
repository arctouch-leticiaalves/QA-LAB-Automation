import { When, Then } from '@wdio/cucumber-framework'
import { TimePickerScreen } from '../screens/time-picker.screen'

When(/^the user selects the time (\d{1,2}):(\d{2}) (AM|PM)$/, async function (
  hour: string,
  minute: string,
  period: string,
) {
  this.timePicker = new TimePickerScreen()
  this.selectedTime = this.timePicker.toDisplayTime(
    hour,
    minute,
    period as 'AM' | 'PM',
  )
  await this.timePicker.selectTime(hour, minute, period as 'AM' | 'PM')
})

Then(/^the selected time should be displayed$/, async function () {
  expect(await this.timePicker.isTimeSelected(this.selectedTime)).toBe(true)
})
