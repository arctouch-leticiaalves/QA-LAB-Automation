# Locator Debt

Tracks Android elements that lack stable accessibility identifiers and force the test suite to use lower-priority locator strategies. Each item here is a request to the app dev team to add `contentDescription` (preferred) or a stable `resource-id`.

When all items in a row are addressed, delete the row.

| Screen | Element | Current locator | Requested change | Ticket |
|---|---|---|---|---|
| Login | Email input | `//android.widget.EditText[contains(@hint, "Email")]` (XPath) | Add `contentDescription="emailField"` to the email TextField | — |
| Login | Password input | `//android.widget.EditText[contains(@hint, "Password")]` (XPath) | Add `contentDescription="passwordField"` to the password TextField | — |
| Login | Show password toggle | parent has `content-desc="Show password"` but the actual button has none | Add `contentDescription="passwordVisibilityToggle"` to the IconButton | — |

## Why this list exists

The skill `appium-selectors` requires that any XPath or non-accessibility-id locator carry a comment with the rationale and an entry in this file. The list helps the team:

- Schedule a single bulk fix in the app codebase.
- Avoid forgetting the request when devs are heads-down on features.
- Track the maturity of the automation layer (fewer rows = healthier suite).
