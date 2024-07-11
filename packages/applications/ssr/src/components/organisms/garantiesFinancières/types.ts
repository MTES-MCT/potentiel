import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

export type GarantiesFinancièresActuelles = {
  isActuelle: true;
  type: string;
  dateÉchéance?: Iso8601DateTime;
  dateConstitution?: Iso8601DateTime;
  attestation?: string;
  validéLe?: Iso8601DateTime;
  soumisLe?: Iso8601DateTime;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
  actions: Array<
    | 'enregister-attestation'
    | 'demander-mainlevée-gf-pour-projet-abandonné'
    | 'demander-mainlevée-gf-pour-projet-achevé'
    | 'modifier'
  >;
};

export type DépôtGarantiesFinancières = {
  isActuelle: false;
  type: string;
  dateÉchéance?: Iso8601DateTime;
  dateConstitution: Iso8601DateTime;
  attestation: string;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
  actions: Array<'instruire' | 'supprimer' | 'modifier'>;
};
