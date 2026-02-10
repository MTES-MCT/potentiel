import { DateTime, Email } from '@potentiel-domain/common';

import { GarantiesFinancières } from '../../index.js';

export type SoumettreDépôtOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  soumisLe: DateTime.ValueType;
  soumisPar: Email.ValueType;
};
