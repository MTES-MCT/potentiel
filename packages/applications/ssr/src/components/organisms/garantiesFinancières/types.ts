import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

type CommonGarantiesFinancières = {
  type: string;
  dateÉchéance?: Iso8601DateTime;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
};

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

export type DépôtGarantiesFinancières = CommonGarantiesFinancières & {
  isActuelle: false;
  dateConstitution: Iso8601DateTime;
  attestation: string;
  actions: Array<'instruire' | 'supprimer' | 'modifier'>;
};
