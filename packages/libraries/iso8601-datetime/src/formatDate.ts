import { format as formatWithDateFns } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Iso8601DateTime } from './Iso8601DateTime';

export const formatDate = (date: Iso8601DateTime) => {
  return formatWithDateFns(new Date(date), 'dd/MM/yyyy', { locale: fr });
};
