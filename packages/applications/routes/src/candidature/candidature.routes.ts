import { encodeParameter } from '../encodeParameter';

export const importer = '/candidatures/importer';
export const corriger = '/candidatures/corriger';

export const lister = (appelOffre?: string, periode?: string) => {
  const searchParams = new URLSearchParams();

  if (appelOffre) {
    searchParams.set('appelOffre', appelOffre);
  }

  if (periode) {
    searchParams.set('periode', periode);
  }

  return `candidatures${searchParams.toString()}`;
};

export const regénérerAttestations = '/admin/regenerer-attestations.html';
export const prévisualiserAttestation = (identifiantProjet: string) =>
  `/candidatures/${encodeParameter(identifiantProjet)}/previsualiser-attestation`;
