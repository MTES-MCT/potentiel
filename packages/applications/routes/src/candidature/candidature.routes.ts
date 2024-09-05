import { encodeParameter } from '../encodeParameter';

export const importer = '/candidatures/importer';
export const corriger = '/candidatures/corriger';
export const lister = '/candidatures';
export const regénérerAttestations = '/admin/regenerer-attestations.html';
export const prévisualiserAttestation = (identifiantProjet: string) =>
  `/candidatures/${encodeParameter(identifiantProjet)}/previsualiser-attestation`;
