import { Candidature } from '@potentiel-domain/projet';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

export type CommonGarantiesFinancières = {
  type: Candidature.TypeGarantiesFinancières.RawType;
  dateÉchéance?: Iso8601DateTime;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
};
