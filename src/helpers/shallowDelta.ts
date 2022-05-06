/**
 * Provides a map of all the properties that have changed
 * (warning: ignores value that have been removed in the newData)
 * @param previousData
 * @param newData
 * @returns either an object with the changed properties or undefined if no properties have changed
 */

export function shallowDelta(
  previousData: Record<string, any>,
  newData: Record<string, any>
): Record<string, any> | undefined {
  const changes = Object.entries(newData).reduce((delta, [correctionKey, correctionValue]) => {
    // If the specific property is missing from previousData
    // or it's value has changed, add it to the delta
    if (_isValueChanged(correctionKey, correctionValue, previousData)) {
      delta[correctionKey] = correctionValue
    }

    return delta
  }, {})

  return Object.keys(changes).length ? changes : undefined
}

function _isValueChanged(key, newValue, data) {
  return (
    typeof newValue !== 'undefined' &&
    data &&
    (typeof data[key] === 'undefined' || data[key] !== newValue)
  )
}
