import { Entity } from '@potentiel-domain/entity';

export type AchèvementEntity = Entity<
  'achevement',
  {
    identifiantProjet: string;

    attestationConformité: { format: string; date: string };
    preuveTransmissionAuCocontractant: { format: string; date: string };

    dernièreMiseÀJour: {
      date: string;
      utilisateur: string;
    };
  }
>;
