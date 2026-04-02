import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '../../../index.js';

export type ModifierAttestationConformitéOptions = {
  modifiéePar: Email.ValueType;
  modifiéeLe: DateTime.ValueType;
  attestation: DocumentProjet.ValueType;
};
