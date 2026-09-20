export const DRAG_DROP_LOCATORS = {
  backButton: '~Back',

  dragDropTitle:
    'android=new UiSelector().description("Drag & Drop").clickable(false)',

  instructionalHint:
    'android=new UiSelector().descriptionContains("Instructional hint")',

  orderDisplay:
    'android=new UiSelector().descriptionContains("Current order display")',

  /** Matches all list rows: "Item N, position P of 8, draggable" */
  draggableItems:
    'android=new UiSelector().descriptionContains(", draggable")',

  /** Accessibility label pattern: "Item N, position P of 8, draggable" */
  draggableItem: (itemName: string) =>
    `android=new UiSelector().descriptionContains("${itemName}, position")`,

  draggableItemAtPosition: (itemName: string, position: number) =>
    `android=new UiSelector().description("${itemName}, position ${position} of 8, draggable")`,
} as const
