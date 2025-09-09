import { Entity } from '@potentiel-domain/entity';

export type GarantiesFinancièresEnAttenteEntity = Entity<
  'projet-avec-garanties-financieres-en-attente',
  {
    identifiantProjet: string;

    motif: string;
    dateLimiteSoumission: string;
    dernièreMiseÀJour: {
      date: string;
    };
  }
>;
