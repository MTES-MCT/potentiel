import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GarantiesFinancières } from '../..';

export type SoumettreDépôtOptions = {
  garantiesFinancières: GarantiesFinancières.ValueType;
  attestation: DocumentProjet.ValueType;
  dateConstitution: DateTime.ValueType;
  soumisLe: DateTime.ValueType;
  soumisPar: Email.ValueType;
};
