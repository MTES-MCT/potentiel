import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export type FormattedForPageDate = `${string}/${string}/${string}`;

const FormattedForPageDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

const isFormattedForPageDate = (date: string) => FormattedForPageDateRegex.test(date);

export const displayDate = (date: Date | number | string): FormattedForPageDate => {
  if (typeof date === 'string') {
    if (isFormattedForPageDate(date)) {
      return date as FormattedForPageDate;
    }
    const parseDate = new Date(date);
    if (isNaN(parseDate.getTime())) {
      throw new Error(`[displayDate] ${date} is not a valid date string`);
    }
    return format(parseDate, 'dd/MM/yyyy', { locale: fr }) as FormattedForPageDate;
  }
  return format(date, 'dd/MM/yyyy', { locale: fr }) as FormattedForPageDate;
};
