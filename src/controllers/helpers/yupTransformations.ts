import { parse } from 'date-fns'

export const iso8601DateToDateYupTransformation = (_, originalValue) =>
  originalValue !== '' ? parse(originalValue, 'yyyy-MM-dd', new Date()) : null
