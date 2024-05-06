import { Entity } from '@potentiel-domain/core';

export type AttestationConformitéEntity = Entity<
  'attestation-conformite',
  {
    identifiantProjet: string;
    nomProjet: string;
    régionProjet: string;
    appelOffre: string;
    période: string;
    famille?: string;

    attestation: { format: string };
    dateTransmission: string;
    dateTransmissionAuCocontractant: string;
    preuveTransmissionAuCocontractant: { format: string };

    dernièreMiseÀJour: {
      date: string;
      utilisateur: string;
    };
  }
>;
