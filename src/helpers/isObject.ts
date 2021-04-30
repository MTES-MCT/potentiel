/**
 * Detect if the argument is a simple object created from Object() or as {...} (not a Date, Array, etc.)
 * @param obj the object to be tested
 * @returns boolean
 */
export const isObject = (obj) => Object.getPrototypeOf(obj) === Object.prototype
