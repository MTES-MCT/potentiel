import moment from 'moment-timezone'
import toNumber from './toNumber'

export const isStrictlyPositiveNumber = (nbr): boolean => {
  return isNumber(nbr) && toNumber(nbr) > 0
}

export const isPositiveNumber = (nbr): boolean => {
  return isNumber(nbr) && toNumber(nbr) >= 0
}

export const isNumber = (nbr): boolean => {
  if (typeof nbr === 'number') return true
  if (typeof nbr !== 'string') return false

  // Accept "," as a decimal separator
  const cleanNbr = nbr.replace(/,/g, '.')

  return !isNaN(Number(cleanNbr)) && !isNaN(parseFloat(cleanNbr))
}

export function isDateFormatValid(dateStr: string, dateFormat: string): boolean {
  return !!dateStr && moment(dateStr, dateFormat).format(dateFormat) === dateStr
}
