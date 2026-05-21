import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '../../../index.js';

export type TransmettreAttestationConformitéOptions = {
  identifiantUtilisateur: Email.ValueType;
  date: DateTime.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  attestation: DocumentProjet.ValueType;
  rapportAssocié: DocumentProjet.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
};
