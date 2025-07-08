import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

export type ModifierAttestationConformitéOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  attestation: DocumentProjet.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  preuveTransmissionAuCocontractant: DocumentProjet.ValueType;
  date: DateTime.ValueType;
};
