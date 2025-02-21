import { Entity } from '@potentiel-domain/entity';

export type ProjetAvecGarantiesFinancièresEnAttenteEntity = Entity<
  'projet-avec-garanties-financieres-en-attente',
  {
    identifiantProjet: string;
    projet: {
      nom: string;
      région: string;
      appelOffre: string;
      période: string;
      famille?: string;
    };
    motif: string;
    dateLimiteSoumission: string;
    dernièreMiseÀJour: {
      date: string;
    };
  }
>;
