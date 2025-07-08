import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { IdentifiantProjet } from '../../../..';

export type TransmettreAttestationConformitéOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  attestation: DocumentProjet.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  date: DateTime.ValueType;
};
