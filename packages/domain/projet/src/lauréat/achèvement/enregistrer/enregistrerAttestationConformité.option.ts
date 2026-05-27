import type { DateTime, Email } from '@potentiel-domain/common';

export type EnregistrerAttestationConformitéOptions = {
  attestationConformité: { format: string };
  rapportAssocié: { format: string };
  enregistréeLe: DateTime.ValueType;
  enregistréePar: Email.ValueType;
};
