import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet } from '../../../index.js';

export type ModifierAchèvementOptions = {
  identifiantUtilisateur: Email.ValueType;
  date: DateTime.ValueType;
  dateTransmissionAuCocontractant: DateTime.ValueType;
  raison: string;
  attestation?: DocumentProjet.ValueType;
  rapportAssocié?: DocumentProjet.ValueType;
  preuveTransmissionAuCocontractant?: DocumentProjet.ValueType;
};
