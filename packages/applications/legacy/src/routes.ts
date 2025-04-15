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

const withProjectId = (url: string) => (projectId: Project['id']) => withParams(url)({ projectId });

export { withParams };

class routes {
  static ABONNEMENT_LETTRE_INFORMATION = '/abonnement-lettre-information.html';
  static POST_SINSCRIRE_LETTRE_INFORMATION = '/s-inscrire-a-la-lettre-d-information';

  static ADMIN_GARANTIES_FINANCIERES = '/admin/garanties-financieres.html';

  static ADMIN_STATISTIQUES = '/admin/statistiques.html';
  static ADEME_STATISTIQUES = '/ademe/statistiques.html';
  static ACHETEUR_OBLIGE_STATISTIQUES = '/acheteur-oblige/statistiques.html';
  static GET_CRE_STATISTIQUES = '/cre/statistiques.html';

  static PROJECT_DETAILS = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/details.html';
    if (projectId) {
      return route.replace(':projectId', encodeURIComponent(projectId));
    } else return route;
  };

  static CHOISIR_CAHIER_DES_CHARGES = (projetId?: Project['id']) => {
    const route = '/projet/:projetId/choisir-cahier-des-charges.html';
    if (projetId) {
      return route.replace(':projetId', projetId);
    } else return route;
  };

  static EXPORTER_LISTE_PROJETS_CSV = '/export-liste-projets.csv';
  static ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV = '/export-projets-laureats.csv';
  static ADMIN_LIST_REQUESTS = '/admin/demandes.html';

  static ADMIN_REPLY_TO_MODIFICATION_REQUEST = '/admin/replyToModificationRequest';
  static ADMIN_REPONDRE_DEMANDE_DELAI = '/admin/repondre-demande-delai';

  static ADMIN_ANNULER_DELAI_REJETE = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/annuler-rejet-demande-delai';
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId);
    } else return route;
  };

  static ADMIN_ANNULER_CHANGEMENT_DE_PUISSANCE_REJETE =
    '/admin/demande/annuler-rejet-demande-changement-de-puissance';

  static ADMIN_SIGNALER_DEMANDE_DELAI_PAGE = (projectId?: Project['id']) => {
    const route = '/admin/projet/:projectId/signalerDemandeDelai.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };
  static ADMIN_SIGNALER_DEMANDE_DELAI_POST = '/admin/signalerDemandeDelai';

  static ADMIN_PASSER_DEMANDE_DELAI_EN_INSTRUCTION = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/passer-demande-delai-en-instruction';
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId);
    } else return route;
  };

  static SUCCESS_OR_ERROR_PAGE = withParams<{
    success?: string;
    error?: string;
    redirectUrl?: string;
    redirectTitle?: string;
  }>('/confirmation.html');

  static LISTE_PROJETS = '/projets.html';

  static USER_LIST_REQUESTS = '/mes-demandes.html';
  static DEMANDE_GENERIQUE = '/demande-modification.html';

  static DEMANDER_DELAI = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/demander-delai.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };

  static DEMANDER_CHANGEMENT_PUISSANCE = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/demander-changement-puissance.html';
    return projectId ? route.replace(':projectId', projectId) : route;
  };

  static GET_CHANGER_PRODUCTEUR = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/changer-producteur.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };

  static CHANGER_FOURNISSEUR = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/changer-fournisseur.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };

  static CHANGER_CDC = '/changer-CDC';

  static DEMANDE_ACTION = '/soumettre-demande';

  static DEMANDE_DELAI_ACTION = '/soumettre-demande-delai';

  static ANNULER_DEMANDE_ACTION = '/annuler-demande';
  static ANNULER_DEMANDE_DELAI = '/annuler-demande-delai';

  static POST_CHANGER_PRODUCTEUR = '/soumettre-changement-producteur';
  static CHANGEMENT_FOURNISSEUR_ACTION = '/soumettre-changement-fournisseur';
  static CHANGEMENT_PUISSANCE_ACTION = '/soumettre-changement-puissance';

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

  static GET_DETAILS_DEMANDE_DELAI_PAGE = (demandeDelaiId?: string) => {
    const route = '/demande-delai/:demandeDelaiId/details.html';
    if (demandeDelaiId) {
      return route.replace(':demandeDelaiId', encodeURIComponent(demandeDelaiId));
    } else return route;
  };

  static GET_CORRIGER_DELAI_ACCORDE_PAGE = (demandeDelaiId?: string) => {
    const route = '/demande-delai/:demandeDelaiId/corriger.html';
    if (demandeDelaiId) {
      return route.replace(':demandeDelaiId', encodeURIComponent(demandeDelaiId));
    } else return route;
  };

  static POST_CORRIGER_DELAI_ACCORDE = '/corriger-delai-accorde.html';

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
