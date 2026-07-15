# Locator Debt

Tracks Android elements that lack stable accessibility identifiers and force the test suite to use lower-priority locator strategies. Each item here is a request to the app dev team to add `contentDescription` (preferred) or a stable `resource-id`.

When all items in a row are addressed, delete the row.

| Screens affected | Element | Current locator | Requested change | Ticket |
|---|---|---|---|---|
| Login, Sign Up (and Forgot Password when it lands) | Email input (shared widget) | `//android.widget.EditText[starts-with(@hint, "Email")]` (XPath) — `COMMON_LOCATORS.emailField` | Add `contentDescription="emailField"` to the shared email TextField widget. One fix backfills all three screens. | — |
| Login, Sign Up (and Forgot Password when it lands) | Password input (shared widget) | `//android.widget.EditText[starts-with(@hint, "Password input field")]` (XPath) — `COMMON_LOCATORS.passwordField` | Add `contentDescription="passwordField"` to the shared password TextField widget. One fix backfills all three screens. | — |
| Login | Show password toggle | parent has `content-desc="Show password"` but the actual button has none | Add `contentDescription="passwordVisibilityToggle"` to the IconButton | — |
| Sign Up | Full Name input | `//android.widget.EditText[starts-with(@hint, "Full name")]` (XPath) | Add `contentDescription="fullNameField"` | — |
| Sign Up | Phone (optional) input | `//android.widget.EditText[starts-with(@hint, "Phone")]` (XPath) | Add `contentDescription="phoneField"` | — |
| Sign Up | Confirm Password input | `//android.widget.EditText[starts-with(@hint, "Confirm")]` (XPath) | Add `contentDescription="confirmPasswordField"` | — |
| Edit Profile | Full Name input | `//android.widget.EditText[starts-with(@hint, "Name input field")]` (XPath) — `PROFILE_LOCATORS.fullNameField` | Add `contentDescription="fullNameField"` | — |
| Edit Profile | Email input | `//android.widget.EditText[starts-with(@hint, "Email input field")]` (XPath) — `PROFILE_LOCATORS.emailField` | Add `contentDescription="emailField"` | — |
| Edit Profile | Phone input | `//android.widget.EditText[starts-with(@hint, "Phone input field")]` (XPath) — `PROFILE_LOCATORS.phoneField` | Add `contentDescription="phoneField"` | — |
| Edit Profile | Address input | `//android.widget.EditText[starts-with(@hint, "Address input field")]` (XPath) — `PROFILE_LOCATORS.addressField` | Add `contentDescription="addressField"` | — |
| Edit Profile | City input | `//android.widget.EditText[starts-with(@hint, "City input field")]` (XPath) — `PROFILE_LOCATORS.cityField` | Add `contentDescription="cityField"` | — |
| Edit Profile | State input | `//android.widget.EditText[starts-with(@hint, "State input field")]` (XPath) — `PROFILE_LOCATORS.stateField` | Add `contentDescription="stateField"` | — |
| Edit Profile | ZIP Code input | `//android.widget.EditText[starts-with(@hint, "ZIP code input field")]` (XPath) — `PROFILE_LOCATORS.zipCodeField` | Add `contentDescription="zipCodeField"` | — |

## Why this list exists

The skill `appium-selectors` requires that any XPath or non-accessibility-id locator carry a comment with the rationale and an entry in this file. The list helps the team:

- Schedule a single bulk fix in the app codebase.
- Avoid forgetting the request when devs are heads-down on features.
- Track the maturity of the automation layer (fewer rows = healthier suite).
