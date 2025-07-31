import querystring from 'querystring';
import type { Project } from './entities';

const withParams =
  <T extends Record<string, any>>(url: string) =>
  (params?: T) => {
    if (!params) return url;

    let priorQuery = {};
    if (url.indexOf('?') > -1) {
      priorQuery = querystring.parse(url.substring(url.indexOf('?') + 1));
    }

    const newQueryString = querystring.stringify({ ...priorQuery, ...params });

    return (
      (url.indexOf('?') === -1 ? url : url.substring(0, url.indexOf('?'))) +
      (newQueryString.length ? '?' + newQueryString.toString() : '')
    );
  };

class routes {
  static PROJECT_DETAILS = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/details.html';
    if (projectId) {
      return route.replace(':projectId', encodeURIComponent(projectId));
    } else return route;
  };

  static EXPORTER_LISTE_PROJETS_CSV = '/export-liste-projets.csv';
  static ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV = '/export-projets-laureats.csv';
  static ADMIN_LIST_REQUESTS = '/admin/demandes.html';

  static ADMIN_REPLY_TO_MODIFICATION_REQUEST = '/admin/replyToModificationRequest';

  static SUCCESS_OR_ERROR_PAGE = withParams<{
    success?: string;
    error?: string;
    redirectUrl?: string;
    redirectTitle?: string;
  }>('/confirmation.html');

  static LISTE_PROJETS = '/projets.html';

  static USER_LIST_REQUESTS = '/mes-demandes.html';

  static DEMANDE_ACTION = '/soumettre-demande';

  static ANNULER_DEMANDE_ACTION = '/annuler-demande';

  static DOWNLOAD_PROJECT_FILE = (fileId?: string, filename?: string) => {
    const route = '/telechargement/:fileId/fichier/:filename';
    if (fileId && filename) {
      return route.replace(':fileId', fileId).replace(':filename', filename);
    } else return route;
  };

  static DEMANDE_PAGE_DETAILS = (modificationRequestId?: string) => {
    const route = '/demande/:modificationRequestId/details.html';
    if (modificationRequestId) {
      return route.replace(':modificationRequestId', encodeURIComponent(modificationRequestId));
    } else return route;
  };

  static TELECHARGER_MODELE_REPONSE = (
    project?: { potentielIdentifier: string; id: string },
    modificationRequestId?: string,
  ) => {
    const route = '/projet/:projectId/demande/:modificationRequestId/telecharger-reponse';
    if (project && modificationRequestId) {
      return route
        .replace(':projectId', project.id)
        .replace(':modificationRequestId', modificationRequestId);
    } else return route;
  };

  static ATTACHER_FICHIER_AU_PROJET_ACTION = '/attacher-fichier-au-projet';
  static RETIRER_FICHIER_DU_PROJET_ACTION = '/retirer-fichier-du-projet';
}
export default routes;
