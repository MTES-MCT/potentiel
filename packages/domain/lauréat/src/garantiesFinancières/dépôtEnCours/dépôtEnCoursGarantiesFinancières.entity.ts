import { Entity } from '@potentiel-domain/entity';

export type DépôtEnCoursGarantiesFinancièresEntity = Entity<
  'depot-en-cours-garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;
    dépôt: {
      type: string;
      dateÉchéance?: string;
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
