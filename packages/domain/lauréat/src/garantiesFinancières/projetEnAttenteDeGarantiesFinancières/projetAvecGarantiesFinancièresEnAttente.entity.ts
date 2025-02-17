import { Entity } from '@potentiel-domain/entity';

export type ProjetAvecGarantiesFinancièresEnAttenteEntity = Entity<
  'projet-avec-garanties-financieres-en-attente',
  {
    identifiantProjet: string;
    projet: {
      nom: string;
      appelOffre: string;
      période: string;
      famille?: string;
      numéroCRE: string;
      région: string;
    };
    motif: string;
    dateLimiteSoumission: string;
    dernièreMiseÀJour: {
      date: string;
    };
  }
>;
