import { format as formatWithDateFns } from 'date-fns';
import { fr } from 'date-fns/locale';

export type Iso8601DateTime =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

export const now = () => new Date().toISOString() as Iso8601DateTime;

type Format = 'dd/MM/yyyy';

export const formatDate = (date: Iso8601DateTime, format: Format) => {
  return formatWithDateFns(new Date(date), format, { locale: fr });
};
