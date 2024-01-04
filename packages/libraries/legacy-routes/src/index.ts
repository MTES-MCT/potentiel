import { withParams } from './helpers/withParams';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_LISTE_PROJETS = '/projets.html';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_LISTE_DEMANDES = '/admin/demandes.html';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_IMPORT_CANDIDATS = '/admin/importer-candidats.html';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_IMPORT_DOCUMENTS_HISTORIQUE = '/admin/importer-documents-historiques';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_IMPORT_DATES_MISE_EN_SERVICE = '/admin/importer-dates-mise-en-service.html';
export const POST_IMPORT_DATES_MISE_EN_SERVICE = `/admin/importer-dates-mise-en-service`;

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_NOTIFIER_CANDIDATS = withParams<{
  appelOffreId: string;
  periodeId: string;
}>('/admin/notifier-candidats.html');
export const POST_NOTIFIER_CANDIDATS = '/admin/envoyer-les-notifications-aux-candidats';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_REGENERER_CERTIFICATS = '/admin/regenerer-attestations.html';
export const POST_REGENERER_CERTIFICATS = '/admin/regenerer-attestations';
