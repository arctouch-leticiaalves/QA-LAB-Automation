export const STAR_RATING_LOCATORS = {
  starRatingTitle:
    'android=new UiSelector().description("Star Rating").clickable(false)',

  ratingValue: (value: number) =>
    `android=new UiSelector().descriptionContains("Star rating, current value ${value} of 5")`,

  rateStars: (value: number) => {
    const label = value === 1 ? 'Rate 1 star' : `Rate ${value} stars`
    return `~${label}`
  },

  submitRatingButton: '~Submit Rating',
  resetRatingButton: '~Reset',

  ratingSubmitted: (value: number) =>
    `android=new UiSelector().descriptionContains("Rating submitted: ${value} out of 5 stars")`,

  tapPrompt:
    'android=new UiSelector().descriptionContains("Tap a star to rate")',
} as const
