import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

export type CommonGarantiesFinancières = {
  type: string;
  dateÉchéance?: Iso8601DateTime;
  dernièreMiseÀJour: {
    date: Iso8601DateTime;
    par?: string;
  };
};
