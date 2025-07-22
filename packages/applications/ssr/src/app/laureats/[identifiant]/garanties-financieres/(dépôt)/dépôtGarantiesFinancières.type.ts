import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { CommonGarantiesFinancières } from '../garantiesFinancières.type';

export type DépôtGarantiesFinancières = CommonGarantiesFinancières & {
  isActuelle: false;
  dateConstitution: Iso8601DateTime;
  attestation: string;
  actions: Array<'instruire' | 'supprimer' | 'modifier'>;
};
