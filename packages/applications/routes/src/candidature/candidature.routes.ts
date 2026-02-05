import { encodeParameter } from '../encodeParameter.js';

type ImporterParams = {
  estUnReimport?: boolean;
};

export const importer = (params?: ImporterParams) => {
  const searchParams = new URLSearchParams();

  if (params?.estUnReimport) {
    searchParams.set('estUnReimport', 'true');
  }

  return `/candidatures/importer${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

export const corrigerParLot = '/candidatures/corriger-par-lot';

type ListerFilters = {
  appelOffre?: string;
  période?: string;
  statut?: 'classé' | 'éliminé';
  estNotifié?: boolean;
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
  if (filters?.estNotifié !== undefined) {
    searchParams.set('notifie', filters.estNotifié ? 'notifie' : 'a-notifier');
  }

  return `/candidatures${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};

const _avecIdentifiant =
  (path = '') =>
  (identifiantProjet: string) =>
    `/candidatures/${encodeParameter(identifiantProjet)}${path}`;

export const détails = _avecIdentifiant();
export const corriger = _avecIdentifiant('/corriger');

export const prévisualiserAttestation = _avecIdentifiant('/previsualiser-attestation');
// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
export const téléchargerAttestation = _avecIdentifiant('/telecharger-attestation');

export const exporterFournisseur = (filters: {
  appelOffre?: string[];
  periode?: string;
  famille?: string;
  typeActionnariat?: string[];
}) => {
  const searchParams = new URLSearchParams();

  if (filters.appelOffre?.length) {
    filters.appelOffre.forEach((value) => {
      searchParams.append('appelOffre', value);
    });
  }
  if (filters.periode) {
    searchParams.append('periode', filters.periode);
  }
  if (filters.famille) {
    searchParams.append('famille', filters.famille);
  }
  if (filters.typeActionnariat?.length) {
    filters.typeActionnariat.forEach((value) => {
      searchParams.append('typeActionnariat', value);
    });
  }
  return `/candidatures/export-fournisseurs${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
};
