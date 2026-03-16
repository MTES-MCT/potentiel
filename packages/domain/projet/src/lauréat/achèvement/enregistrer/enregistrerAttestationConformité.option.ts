import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

export type EnregistrerAttestationConformitéOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  attestationConformité: { format: string };
  enregistréeLe: DateTime.ValueType;
  enregistréePar: Email.ValueType;
};
