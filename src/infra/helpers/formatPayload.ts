const formatISOStringToDate = (value) => {
  const regexISO =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/

  if (typeof value === 'string') {
    if (regexISO.exec(value)) {
      return new Date(value)
    }
  }
  return value
}

export const formatPayload = (payload: { [key: string]: any }) => {
  return Object.entries(payload).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: formatISOStringToDate(value),
    }
  }, {})
}
