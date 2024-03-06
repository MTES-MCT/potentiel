import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateForInput = (date: string) =>
  format(new Date(date), 'yyyy-MM-dd', { locale: fr });
