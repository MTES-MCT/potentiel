import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { CommonGarantiesFinancières } from '../garantiesFinancières.type';

export type GarantiesFinancièresActuelles = CommonGarantiesFinancières & {
  isActuelle: true;
  statut: GarantiesFinancières.StatutGarantiesFinancières.RawType;
  dateConstitution?: Iso8601DateTime;
  attestation?: string;
  validéLe?: Iso8601DateTime;
  soumisLe?: Iso8601DateTime;
  actions: Array<
    | 'enregister-attestation'
    | 'demander-mainlevée-gf-pour-projet-abandonné'
    | 'demander-mainlevée-gf-pour-projet-achevé'
    | 'modifier'
    | 'contacter-porteur-pour-gf-échues'
  >;
};
