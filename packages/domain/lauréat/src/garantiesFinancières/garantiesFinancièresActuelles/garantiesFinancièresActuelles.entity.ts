import { Entity } from '@potentiel-domain/core';

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;

    garantiesFinancières: {
      type: string;
      dateÉchéance?: string;
      attestation?: { format: string };
      dateConstitution?: string;
      soumisLe?: string;
      validéLe?: string;
      typeImportéLe?: string;
      dernièreMiseÀJour: {
        date: string;
        par: string;
      };
    };
  }
>;
