import { Entity } from '@potentiel-domain/entity';

export type DépôtGarantiesFinancièresEntity = Entity<
  'depot-en-cours-garanties-financieres',
  {
    identifiantProjet: string;

    dépôt: {
      type: string;
      dateÉchéance?: string;
      dateDélibération?: string;
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
