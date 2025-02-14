import { Entity } from '@potentiel-domain/entity';

export type AchèvementEntity = Entity<
  'achevement',
  {
    identifiantProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;
    nomProjet: string;
    régionProjet: string;
    numéroCRE: string;

    attestationConformité: { format: string; date: string };
    preuveTransmissionAuCocontractant: { format: string; date: string };

    dernièreMiseÀJour: {
      date: string;
      utilisateur: string;
    };
  }
>;
