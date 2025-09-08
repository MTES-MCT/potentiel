import { DateTime, Email } from '@potentiel-domain/common';

import { MotifDemandeMainlevéeGarantiesFinancières } from '../..';

export type DemanderMainlevéeOptions = {
  motif: MotifDemandeMainlevéeGarantiesFinancières.ValueType;
  demandéLe: DateTime.ValueType;
  demandéPar: Email.ValueType;
};
