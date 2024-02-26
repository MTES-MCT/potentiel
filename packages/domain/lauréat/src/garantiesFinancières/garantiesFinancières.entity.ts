import { Entity } from '@potentiel-domain/core';

export type GarantiesFinancièresEntity = Entity<
  'garanties-financieres',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: Array<string>;
    appelOffre: string;
    période: string;
    famille?: string;

    statut: string;
    misÀJourLe: string;

    validées?: {
      type: string;
      dateÉchéance?: string;
      attestation: { format: string };
      dateConstitution: string;
      validéLe: string;
    };
    àTraiter?: {
      type: string;
      dateÉchéance?: string;
      attestation: { format: string };
      dateConstitution: string;
      soumisLe: string;
    };
    enAttente?: { dateLimiteSoumission: string; demandéLe: string };
  }
>;
