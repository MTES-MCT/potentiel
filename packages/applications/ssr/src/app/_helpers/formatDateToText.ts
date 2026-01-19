import { DateTime } from '@potentiel-domain/common';

export const formatDateToText = (date: DateTime.RawType) =>
  Intl.DateTimeFormat('fr').format(new Date(date));
