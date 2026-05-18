import type { DateTime, Email } from '@potentiel-domain/common';

import type { GarantiesFinancières } from '../../index.js';

export type SoumettreDépôtOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  soumisLe: DateTime.ValueType;
  soumisPar: Email.ValueType;
};
