/* eslint-disable import/no-duplicates */
import { formatInTimeZone } from 'date-fns-tz';
import { fr } from 'date-fns/locale';

const formatDateToString = (
  timestamp: number | Date,
  dateFormat?: 'dd/MM/yyyy' | 'd MMMM yyyy' | 'dd-MM-yyyy' | 'dd/MM/yyyy HH:mm',
) => formatInTimeZone(timestamp, 'Europe/Paris', dateFormat || 'dd/MM/yyyy', { locale: fr });

export { formatDateToString };
