import { Entity } from '@potentiel-domain/core';

export type AchèvementEntity = Entity<
  'achevement',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;

    attestationConformité: { format: string };
    dateTransmissionAttestationConformité: string;
    dateTransmissionAuCocontractant: string;
    preuveTransmissionAuCocontractant: { format: string };

    dernièreMiseÀJour: {
      date: string;
      utilisateur: string;
    };
  }
>;
