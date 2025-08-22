import type { DateTime } from '@potentiel-domain/common';

import type { MotifDemandeGarantiesFinancières } from '..';

export type DemanderOptions = {
  demandéLe: DateTime.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  motif: MotifDemandeGarantiesFinancières.ValueType;
};
