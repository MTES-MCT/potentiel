import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../index.js';

export type TransmettreAttestationConformitéOptions = {
  identifiantUtilisateur: Email.ValueType;
  attestation: DocumentProjet.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  date: DateTime.ValueType;
};
