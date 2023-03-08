/* eslint-disable import/no-duplicates */
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const afficherDate = (date: Date | number) => format(date, 'dd/MM/yyyy', { locale: fr });
