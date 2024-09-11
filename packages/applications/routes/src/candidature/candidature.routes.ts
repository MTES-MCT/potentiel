import { encodeParameter } from '../encodeParameter';

export const importer = '/candidatures/importer';
export const corriger = '/candidatures/corriger';

type ListerFilters = {
  appelOffre?: string;
  période?: string;
  statut?: 'classé' | 'éliminé';
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
// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
export const téléchargerAttestation = (identifiantProjet: string) =>
  `/candidatures/${encodeParameter(identifiantProjet)}/telecharger-attestation`;
