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
    actuelles?: {
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
    dépôts: Array<{
      type: string;
      dateÉchéance?: string;
      statut: string;
      dateConstitution: string;
      attestation: { format: string };
      soumisLe: string;
      dernièreMiseÀJour: {
        date: string;
        par: string;
      };
    }>;
  }
>;
