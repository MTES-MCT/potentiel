/* eslint-disable import/no-duplicates */
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const afficherDateAvecHeure = (date: Date | number) =>
  format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
