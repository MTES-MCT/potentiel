import { DateTime } from '@potentiel-domain/common';

import { MotifDemandeGarantiesFinancières } from '../..';

export type DemanderOptions = {
  demandéLe: DateTime.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  motif: MotifDemandeGarantiesFinancières.ValueType;
};
