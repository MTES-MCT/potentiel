import type { DateTime, Email } from '@potentiel-domain/common';

import type { MotifMainlevéeGarantiesFinancières } from '../../index.js';

export type AccorderMainlevéeOptions = {
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  motif: MotifMainlevéeGarantiesFinancières.ValueType;
  réponseSignée: {
    format: string;
  };
};
