import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '#document-projet';
import type { MotifMainlevéeGarantiesFinancières } from '../../index.js';

export type AccorderMainlevéeOptions = {
  accordéLe: DateTime.ValueType;
  accordéPar: Email.ValueType;
  motif: MotifMainlevéeGarantiesFinancières.ValueType;
  réponseSignée: DocumentProjet.ValueType;
};
