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
  static HOME = '/';
  static STATS = '/stats.html';
  static ABONNEMENT_LETTRE_INFORMATION = '/abonnement-lettre-information.html';
  static POST_SINSCRIRE_LETTRE_INFORMATION = '/s-inscrire-a-la-lettre-d-information';
  static DECLARATION_ACCESSIBILITE = '/accessibilite.html';
  static SIGNUP = '/signup.html';
  static POST_SIGNUP = '/signup';

  static ADMIN_GARANTIES_FINANCIERES = '/admin/garanties-financieres.html';

  // static ADMIN_AO_PERIODE = '/admin/appels-offres.html';
  // static IMPORT_AO_ACTION = '/admin/importAppelsOffres';
  // static IMPORT_PERIODE_ACTION = '/admin/importPeriodes';
  // static EXPORT_AO_CSV = '/admin/appelsOffres.csv';
  // static EXPORT_PERIODE_CSV = '/admin/periodes.csv';

  // static GET_DETAIL_GESTIONNAIRE_RESEAU = (codeEIC?: string) =>
  //   codeEIC ? `/admin/gestionnaires-reseau/${codeEIC}` : `/admin/gestionnaires-reseau/:codeEIC`;

  // static POST_AJOUTER_GESTIONNAIRE_RESEAU = `/admin/gestionnaires-reseau`;
  // static POST_MODIFIER_GESTIONNAIRE_RESEAU = (codeEIC?: string) =>
  //   codeEIC ? `/admin/gestionnaires-reseau/${codeEIC}` : `/admin/gestionnaires-reseau/:codeEIC`;
  // static GET_AJOUTER_GESTIONNAIRE_RESEAU = `/admin/gestionnaires-reseau/ajouter`;

  static UPLOAD_LEGACY_MODIFICATION_FILES = '/admin/importer-documents-historiques';

  static ADMIN_PARTNER_USERS = '/admin/utilisateurs-partenaires.html';

  // static ADMIN_USERS = '/admin/utilisateurs.html';
  static ADMIN_INVITE_USER_ACTION = '/admin/inviterUtilisateur';
  // static ADMIN_INVITE_DREAL_USER_ACTION = '/admin/inviterUtilisateurDreal';

  // static USER_INVITATION = '/enregistrement.html';

  // static LEGACY_IMPORT_PROJECTS_ACTION = '/admin/importer-candidats-legacy.html';
  // static LEGACY_IMPORT_PROJECTS = '/admin/importer-candidats-legacy.html';

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

  // static POST_NOTIFIER_CANDIDATS = '/admin/envoyer-les-notifications-aux-candidats';
  static ADMIN_CORRECT_PROJECT_DATA_ACTION = '/admin/correctProjectData';
  static ADMIN_REPLY_TO_MODIFICATION_REQUEST = '/admin/replyToModificationRequest';
  static ADMIN_REPONDRE_DEMANDE_DELAI = '/admin/repondre-demande-delai';

  static ADMIN_ANNULER_DELAI_REJETE = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/annuler-rejet-demande-delai';
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId);
    } else return route;
  };

  static ADMIN_ANNULER_RECOURS_REJETE = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/annuler-rejet-demande-recours';
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId);
    } else return route;
  };

  static ADMIN_ANNULER_CHANGEMENT_DE_PUISSANCE_REJETE =
    '/admin/demande/annuler-rejet-demande-changement-de-puissance';

  static ADMIN_INVITATION_LIST = '/admin/invitations.html';
  static ADMIN_INVITATION_RELANCE_ACTION = '/admin/relanceInvitations';
  static ADMIN_NOTIFICATION_LIST = '/admin/notifications.html';
  static ADMIN_NOTIFICATION_RETRY_ACTION = '/admin/retryNotifications';

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

  static USER_LIST_MISSING_OWNER_PROJECTS = '/projets-a-reclamer.html';
  static USER_CLAIM_PROJECTS = '/reclamer-propriete-projets.html';
  static USER_LIST_REQUESTS = '/mes-demandes.html';
  static DEMANDE_GENERIQUE = '/demande-modification.html';
  static DEPOSER_RECOURS = withProjectId('/demande-modification.html?action=recours'); //?????

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

  static CHANGER_ACTIONNAIRE = withProjectId('/demande-modification.html?action=actionnaire');

  // static CHANGER_PUISSANCE = withProjectId('/demande-modification.html?action=puissance');

  static CHANGER_CDC = '/changer-CDC';

  static DEMANDE_ACTION = '/soumettre-demande';

  static DEMANDE_DELAI_ACTION = '/soumettre-demande-delai';

  static ANNULER_DEMANDE_ACTION = '/annuler-demande';
  // static POST_ANNULER_DEMANDE_DELAI = '/annuler-demande-delai';
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

  static INVITE_USER_TO_PROJECT_ACTION = '/invite-user-to-project';

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

  static REVOKE_USER_RIGHTS_TO_PROJECT_ACTION = withParams<{
    projectId: string;
    userId: string;
  }>('/retirer-droits');

  static ATTACHER_FICHIER_AU_PROJET_ACTION = '/attacher-fichier-au-projet';
  static RETIRER_FICHIER_DU_PROJET_ACTION = '/retirer-fichier-du-projet';
}
export default routes;
