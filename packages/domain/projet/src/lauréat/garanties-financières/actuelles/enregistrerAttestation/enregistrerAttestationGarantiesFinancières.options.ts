import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet } from '#document-projet';

export type EnregistrerAttestationOptions = {
  attestation: DocumentProjet.ValueType;
  dateConstitution: DateTime.ValueType;
  enregistréLe: DateTime.ValueType;
  enregistréPar: Email.ValueType;
};
