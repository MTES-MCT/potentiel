/**
 * makes the stringified stable, in that the key order is always the same
 * @param key serializable object
 * @returns string
 */
export const stableStringify = (key: any) => JSON.stringify(key, Object.keys(key).sort())
