/**
 *
 * @param date Date au format lisible français (jj/mm/aaaa)
 * @returns Date au format constructeur de Date (aaaa-mm-jj)
 */
export const convertDateFrFormatToDateConstructorFormat = (date: string) =>
  date.split('/').reverse().join('-');
