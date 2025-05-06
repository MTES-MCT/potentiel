import { DateTime } from '@potentiel-domain/common';

export const formatDateQualification = (dateString: string) =>
  DateTime.convertirEnValueType(
    new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1')),
  ).formatter();
