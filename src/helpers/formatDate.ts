/* eslint-disable import/no-duplicates */
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatDate = (
  timestamp: number | Date,
  dateFormat?: 'dd/MM/yyyy' | 'd MMMM yyyy' | 'dd-MM-yyyy' | 'dd/MM/yyyy HH:mm',
) => format(timestamp, dateFormat || 'dd/MM/yyyy', { locale: fr });

export { formatDate };
