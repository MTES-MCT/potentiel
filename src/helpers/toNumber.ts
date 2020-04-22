const toNumber = (str, defaultValue?) => {
  const result =
    typeof str === 'number'
      ? str
      : typeof str === 'string'
      ? Number(str.replace(/,/g, '.'))
      : NaN

  if (isNaN(result)) {
    return defaultValue
  }
  return result
}

export default toNumber
