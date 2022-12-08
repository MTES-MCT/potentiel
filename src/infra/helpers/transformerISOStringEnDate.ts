import { isMatch, parseISO } from 'date-fns'

const ISOStringFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

type Payload =
  | {
      [key: string]: any
    }
  | (string | Payload)[]
  | null
  | undefined

export const transformerISOStringEnDate = (payload: Payload) => {
  if (!payload) return payload

  // cas de payload ARRAY
  if (Array.isArray(payload)) {
    return payload.map((item) => {
      if (typeof item === 'object') {
        return transformerISOStringEnDate(item)
      }

      return isMatch(item, ISOStringFormat) ? parseISO(item) : item
    })
  }

  // cas de payload OBJECT
  return Object.entries(payload).reduce((acc, [key, value]) => {
    if (typeof value === 'object') {
      return {
        ...acc,
        [key]: transformerISOStringEnDate(value),
      }
    }

    return {
      ...acc,
      [key]: isMatch(value, ISOStringFormat) ? parseISO(value) : value,
    }
  }, {})
}
