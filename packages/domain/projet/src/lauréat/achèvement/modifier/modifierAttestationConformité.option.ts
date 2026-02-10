import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../../index.js';

export type ModifierAttestationConformitéOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  attestation?: DocumentProjet.ValueType;
  preuveTransmissionAuCocontractant?: DocumentProjet.ValueType;
  date: DateTime.ValueType;
};
