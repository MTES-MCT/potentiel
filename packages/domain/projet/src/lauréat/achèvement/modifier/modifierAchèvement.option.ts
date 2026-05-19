import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '../../../index.js';

export type ModifierAchèvementOptions = {
  identifiantUtilisateur: Email.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  attestation?: DocumentProjet.ValueType;
  preuveTransmissionAuCocontractant?: DocumentProjet.ValueType;
  date: DateTime.ValueType;
  raison: string;
};
