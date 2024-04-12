import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateForText = (date: string) =>
  format(new Date(date), 'dd/MM/yyyy', { locale: fr });
