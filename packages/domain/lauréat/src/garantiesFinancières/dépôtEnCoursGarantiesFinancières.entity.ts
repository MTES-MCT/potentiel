import { Entity } from '@potentiel-domain/core';

export type DépôtEnCoursGarantiesFinancièresEntity = Entity<
  'depot-en-cours-garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: Array<string>;
    appelOffre: string;
    période: string;
    famille?: string;
    dépôt: {
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
    };
  }
>;
