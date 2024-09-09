import { encodeParameter } from '../encodeParameter';

export const importer = '/candidatures/importer';
export const corriger = '/candidatures/corriger';

type ListerFilters = {
  appelOffre?: string;
  période?: string;
  statut?: 'classés' | 'éliminé';
};

export const lister = (filters?: ListerFilters) => {
  const searchParams = new URLSearchParams();

  if (filters?.appelOffre) {
    searchParams.set('appelOffre', filters.appelOffre);
  }

  if (filters?.période) {
    searchParams.set('periode', filters.période);
  }

  if (filters?.statut) {
    searchParams.set('statut', filters.statut);
  }

  return `/candidatures${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const regénérerAttestations = '/admin/regenerer-attestations.html';
export const prévisualiserAttestation = (identifiantProjet: string) =>
  `/candidatures/${encodeParameter(identifiantProjet)}/previsualiser-attestation`;
