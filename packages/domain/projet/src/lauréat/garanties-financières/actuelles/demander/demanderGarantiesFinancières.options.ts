import type { DateTime } from '@potentiel-domain/common';

import type { MotifDemandeGarantiesFinancières } from '../../index.js';

export type DemanderOptions = {
  demandéLe: DateTime.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  motif: MotifDemandeGarantiesFinancières.ValueType;
};
