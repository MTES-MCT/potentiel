import { createIdentifiantRoute } from '../_helpers/createRoute.js';
import { withFilters } from '../_helpers/withFilters.js';

export const importer = withFilters<{
  estUnReimport?: boolean;
}>(`/candidatures/importer`);
export const corrigerParLot = '/candidatures/corriger-par-lot';

export const lister = withFilters<{
  appelOffre?: string;
  periode?: string;
  statut?: 'classé' | 'éliminé';
  notifie?: 'notifie' | 'a-notifier';
}>(`/candidatures`);

export const exporterFournisseur = withFilters<{
  appelOffre?: string[];
  periode?: string;
  famille?: string;
  typeActionnariat?: string[];
}>(`/candidatures/export-fournisseurs`);

const candidatureRoute = createIdentifiantRoute('/candidatures');

export const détails = candidatureRoute();
export const corriger = candidatureRoute('/corriger');

export const prévisualiserAttestation = candidatureRoute('/previsualiser-attestation');
// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
export const téléchargerAttestation = candidatureRoute('/telecharger-attestation');
