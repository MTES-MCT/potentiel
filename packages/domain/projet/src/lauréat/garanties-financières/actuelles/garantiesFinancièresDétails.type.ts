import { StatutGarantiesFinancières } from '..';

export type GarantiesFinancièresDétails = {
  statut: StatutGarantiesFinancières.RawType;
  type: string;
  dateÉchéance?: string;
  attestation?: { format: string };
  dateConstitution?: string;
  soumisLe?: string;
  validéLe?: string;
  typeImportéLe?: string;
  dernièreMiseÀJour: {
    date: string;
    par?: string;
  };
};
