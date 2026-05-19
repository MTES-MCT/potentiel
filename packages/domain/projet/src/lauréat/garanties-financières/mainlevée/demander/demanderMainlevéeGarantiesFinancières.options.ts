import type { DateTime, Email } from '@potentiel-domain/common';

import type { MotifDemandeMainlevéeGarantiesFinancières } from '../../index.js';

export type DemanderMainlevéeOptions = {
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
};
