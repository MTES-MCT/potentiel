import { parse } from 'date-fns'

export const iso8601DateToDateYupTransformation = (_, originalValue) =>
  stringToDateYupTransformation(originalValue, 'yyyy-MM-dd')

export const stringToDateYupTransformation = (date: string, format: string) =>
  date !== '' ? parse(date, format, new Date()) : null
