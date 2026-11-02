import type { DateTime, Email } from '@potentiel-domain/common';

import type { MotifMainlevéeGarantiesFinancières } from '../../index.js';

export type DemanderMainlevéeOptions = {
  motif: MotifMainlevéeGarantiesFinancières.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
};
