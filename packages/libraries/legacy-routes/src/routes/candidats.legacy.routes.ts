import { withParams } from '../helpers/withParams';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_IMPORT_CANDIDATS = '/admin/importer-candidats.html';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_NOTIFIER_CANDIDATS = withParams<{
  appelOffreId: string;
  periodeId: string;
}>('/admin/notifier-candidats.html');

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const POST_NOTIFIER_CANDIDATS = '/admin/envoyer-les-notifications-aux-candidats';

/**
 * @deprecated à supprimer dès que la migration sera faite
 */
export const GET_LISTE_CANDIDATS_EN_ATTENTE = '/admin/invitations.html';
