/**
 * Isolate the logic for tagging elements in templates and selecting elements in tests
 */

const TEST_ATTRIBUTE = 'data-testid'

// This is used in the react componets: ex: <button {...dataId('my-button')}>
export const dataId = (id: string) => ({ [TEST_ATTRIBUTE]: id })

// This is used for test selectors ex: page.click(testId('my-button'))
export const testId = (id: string): string => `[${TEST_ATTRIBUTE}="${id}"]`
