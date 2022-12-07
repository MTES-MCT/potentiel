import { isMatch, parseISO } from 'date-fns'

const ISOStringFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

export const transformerISOStringEnDate = (payload: { [key: string]: any }) => {
  return Object.entries(payload).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: isMatch(value, ISOStringFormat) ? parseISO(value) : value,
    }
  }, {})
}
