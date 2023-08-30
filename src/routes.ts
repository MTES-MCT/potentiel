import { makeCertificateFilename } from './modules/project';
import querystring from 'querystring';
import sanitize from 'sanitize-filename';
import type { Project } from './entities';
import { RawIdentifiantProjet } from '@potentiel/domain';

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
  static LOGIN = '/login.html';
  static LOGIN_ACTION = '/login.html';
  static STATS = '/stats.html';
  static ABONNEMENT_LETTRE_INFORMATION = '/abonnement-lettre-information.html';
  static POST_SINSCRIRE_LETTRE_INFORMATION = '/s-inscrire-a-la-lettre-d-information';
  static DECLARATION_ACCESSIBILITE = '/accessibilite.html';
  static LOGOUT_ACTION = '/logout';
  static SIGNUP = '/signup.html';
  static POST_SIGNUP = '/signup';

  static REDIRECT_BASED_ON_ROLE = '/go-to-user-dashboard';
  static ADMIN_GARANTIES_FINANCIERES = '/admin/garanties-financieres.html';

  static ADMIN_AO_PERIODE = '/admin/appels-offres.html';
  static IMPORT_AO_ACTION = '/admin/importAppelsOffres';
  static IMPORT_PERIODE_ACTION = '/admin/importPeriodes';
  static EXPORT_AO_CSV = '/admin/appelsOffres.csv';
  static EXPORT_PERIODE_CSV = '/admin/periodes.csv';

  static GET_LISTE_GESTIONNAIRES_RESEAU = `/admin/gestionnaires-reseau`;
  static GET_DETAIL_GESTIONNAIRE_RESEAU = (codeEIC?: string) =>
    codeEIC ? `/admin/gestionnaires-reseau/${codeEIC}` : `/admin/gestionnaires-reseau/:codeEIC`;

  static POST_AJOUTER_GESTIONNAIRE_RESEAU = `/admin/gestionnaires-reseau`;
  static POST_MODIFIER_GESTIONNAIRE_RESEAU = (codeEIC?: string) =>
    codeEIC ? `/admin/gestionnaires-reseau/${codeEIC}` : `/admin/gestionnaires-reseau/:codeEIC`;
  static GET_AJOUTER_GESTIONNAIRE_RESEAU = `/admin/gestionnaires-reseau/ajouter`;

  static UPLOAD_LEGACY_MODIFICATION_FILES = '/admin/importer-documents-historiques';

  static ADMIN_PARTNER_USERS = '/admin/utilisateurs-partenaires.html';

  static ADMIN_USERS = '/admin/utilisateurs.html';
  static ADMIN_INVITE_USER_ACTION = '/admin/inviterUtilisateur';
  static ADMIN_INVITE_DREAL_USER_ACTION = '/admin/inviterUtilisateurDreal';

  static USER_INVITATION = '/enregistrement.html';

  static IMPORT_PROJECTS_ACTION = '/admin/importer-candidats.html';
  static IMPORT_PROJECTS = '/admin/importer-candidats.html';

  static ADMIN_STATISTIQUES = '/admin/statistiques.html';
  static ADEME_STATISTIQUES = '/ademe/statistiques.html';
  static ACHETEUR_OBLIGE_STATISTIQUES = '/acheteur-oblige/statistiques.html';
  static GET_CRE_STATISTIQUES = '/cre/statistiques.html';

  static PROJECT_DETAILS = (projectId?: Project['id'] | RawIdentifiantProjet) => {
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
  static ADMIN_REGENERATE_CERTIFICATES = '/admin/regenerer-attestations.html';
  static ADMIN_REGENERATE_CERTIFICATES_ACTION = '/admin/regenerer-attestations';
  static GET_NOTIFIER_CANDIDATS = withParams<{
    appelOffreId: string;
    periodeId: string;
  }>('/admin/notifier-candidats.html');

  static PREVIEW_CANDIDATE_CERTIFICATE = (project?: {
    id: string;
    email: string;
    potentielIdentifier: string;
  }) => {
    const route = '/previsualiser-attestation/:projectId/:document';
    if (project) {
      return route
        .replace(':projectId', project.id)
        .replace(':document', 'aperçu-' + makeCertificateFilename({ ...project, forAdmin: true }));
    } else return route;
  };

  static DOWNLOAD_CERTIFICATE_FILE = (projectId?: string, fileId?: string, filename?: string) => {
    const route = '/attestation/:projectId/:fileId/:filename';
    if (projectId && fileId && filename) {
      return route
        .replace(':projectId', projectId)
        .replace(':fileId', fileId)
        .replace(':filename', filename);
    } else return route;
  };

  static CANDIDATE_CERTIFICATE_FOR_ADMINS = (project: {
    id: string;
    certificateFileId: string;
    email: string;
    potentielIdentifier: string;
  }) =>
    routes.DOWNLOAD_CERTIFICATE_FILE(
      project.id,
      project.certificateFileId,
      makeCertificateFilename({ ...project, forAdmin: true }),
    );

  static CANDIDATE_CERTIFICATE_FOR_CANDIDATES = (project: {
    id: string;
    certificateFileId: string;
    nomProjet: string;
    potentielIdentifier: string;
  }) =>
    routes.DOWNLOAD_CERTIFICATE_FILE(
      project.id,
      project.certificateFileId,
      makeCertificateFilename({ ...project, forAdmin: false }),
    );

  static POST_NOTIFIER_CANDIDATS = '/admin/envoyer-les-notifications-aux-candidats';
  static ADMIN_CORRECT_PROJECT_DATA_ACTION = '/admin/correctProjectData';
  static ADMIN_REPLY_TO_MODIFICATION_REQUEST = '/admin/replyToModificationRequest';
  static ADMIN_REPONDRE_DEMANDE_DELAI = '/admin/repondre-demande-delai';
  static ADMIN_REPONDRE_DEMANDE_ABANDON = '/admin/repondre-demande-abandon';

  static ADMIN_ANNULER_DELAI_REJETE = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/annuler-rejet-demande-delai';
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId);
    } else return route;
  };

  static ADMIN_ANNULER_ABANDON_REJETE = '/admin/demande/annuler-rejet-demande-abandon';

  static ADMIN_ANNULER_RECOURS_REJETE = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/annuler-rejet-demande-recours';
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId);
    } else return route;
  };

  static ADMIN_ANNULER_CHANGEMENT_DE_PUISSANCE_REJETE =
    '/admin/demande/annuler-rejet-demande-changement-de-puissance';

  static ADMIN_DREAL_LIST = '/admin/dreals.html';
  static ADMIN_INVITATION_LIST = '/admin/invitations.html';
  static ADMIN_INVITATION_RELANCE_ACTION = '/admin/relanceInvitations';
  static ADMIN_NOTIFICATION_LIST = '/admin/notifications.html';
  static ADMIN_NOTIFICATION_RETRY_ACTION = '/admin/retryNotifications';

  static ADMIN_INVITATION_DGEC_VALIDATEUR = '/admin/inviter-dgec-validateur.html';
  static ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION = '/admin/inviter-dgec-validateur';

  static ADMIN_SIGNALER_DEMANDE_DELAI_PAGE = (projectId?: Project['id']) => {
    const route = '/admin/projet/:projectId/signalerDemandeDelai.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };
  static ADMIN_SIGNALER_DEMANDE_DELAI_POST = '/admin/signalerDemandeDelai';

  static ADMIN_SIGNALER_DEMANDE_ABANDON_GET = (projectId?: Project['id']) => {
    const route = '/admin/projet/:projectId/signalerDemandeAbandon.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };
  static ADMIN_SIGNALER_DEMANDE_ABANDON_POST = '/admin/signalerDemandeAbandon';

  static ADMIN_SIGNALER_DEMANDE_RECOURS_GET = (projectId?: Project['id']) => {
    const route = '/admin/projet/:projectId/signalerDemandeRecours.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };
  static ADMIN_SIGNALER_DEMANDE_RECOURS_POST = '/admin/signalerDemandeRecours';

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
  static DEPOSER_RECOURS = withProjectId('/demande-modification.html?action=recours');

  static DEMANDER_DELAI = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/demander-delai.html';
    if (projectId) {
      return route.replace(':projectId', projectId);
    } else return route;
  };

  static GET_DEMANDER_ABANDON = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/demander-abandon.html';
    return projectId ? route.replace(':projectId', projectId) : route;
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

  static CHANGER_PUISSANCE = withProjectId('/demande-modification.html?action=puissance');

  static CHANGER_CDC = '/changer-CDC';

  static DEMANDE_ACTION = '/soumettre-demande';

  static DEMANDE_DELAI_ACTION = '/soumettre-demande-delai';

  static CONFIRMER_DEMANDE_ABANDON = '/confirmer-demande-abandon';

  static ANNULER_DEMANDE_ACTION = '/annuler-demande';
  static ANNULER_DEMANDE_DELAI = '/annuler-demande-delai';
  static POST_DEMANDER_ABANDON = '/soumettre-demande-abandon';
  static ANNULER_DEMANDE_ABANDON_ACTION = '/annuler-demande-abandon';
  static ACCORDER_DEMANDE_ABANDON_ACTION = '/annuler-demande-abandon';

  static POST_DEMANDER_ANNULATION_ABANDON = '/demander-annulation-abandon';
  static POST_ANNULER_DEMANDE_ANNULATION_ABANDON = '/annuler-demande-annulation-abandon';
  static POST_REPONDRE_DEMANDE_ANNULATION_ABANDON = '/repondre-demande-annulation-abandon';

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
      return route.replace(':modificationRequestId', modificationRequestId);
    } else return route;
  };

  static INVITE_USER_TO_PROJECT_ACTION = '/invite-user-to-project';

  /* CRE4 GF */
  static REMOVE_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/annuler-depot/garanties-financieres';
    if (args) {
      const { projectId } = args;
      return route.replace(':projectId', projectId);
    } else return route;
  };
  static SUBMIT_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/deposer/garanties-financieres';
    if (args) {
      const { projectId } = args;
      return route.replace(':projectId', projectId);
    } else return route;
  };

  /* PPE2 GF */
  static WITHDRAW_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/supprimer/garanties-financieres';
    if (args) {
      const { projectId } = args;
      return route.replace(':projectId', projectId);
    } else return route;
  };
  static UPLOAD_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/enregistrer/garanties-financieres';
    if (args) {
      const { projectId } = args;
      return route.replace(':projectId', projectId);
    } else return route;
  };

  static ADD_GF_EXPIRATION_DATE = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/actualiser/garanties-financieres';
    if (args) {
      const { projectId } = args;
      return route.replace(':projectId', projectId);
    } else return route;
  };

  static VALIDER_GF = (args?: { projetId: string }) => {
    const route = '/projet/:projetId/valider/garanties-financieres';
    if (args) {
      const { projetId } = args;
      return route.replace(':projetId', projetId);
    } else return route;
  };

  static INVALIDER_GF = (args?: { projetId: string }) => {
    const route = '/projet/:projetId/invalider/garanties-financieres';
    if (args) {
      const { projetId } = args;
      return route.replace(':projetId', projetId);
    } else return route;
  };

  static TELECHARGER_MODELE_MISE_EN_DEMEURE = (project?: { id: string; nomProjet: string }) => {
    const route = '/projet/:projectId/telecharger-mise-en-demeure/:filename';
    if (project) {
      return route
        .replace(':projectId', project.id)
        .replace(
          ':filename',
          sanitize(`Mise en demeure Garanties Financières - ${project.nomProjet}.docx`),
        );
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

  static REVOKE_USER_RIGHTS_TO_PROJECT_ACTION = withParams<{
    projectId: string;
    userId: string;
  }>('/retirer-droits');

  static ATTACHER_FICHIER_AU_PROJET_ACTION = '/attacher-fichier-au-projet';
  static RETIRER_FICHIER_DU_PROJET_ACTION = '/retirer-fichier-du-projet';

  static GET_LISTE_DOSSIERS_RACCORDEMENT = (identifiantProjet?: RawIdentifiantProjet) => {
    const route = '/projet/:identifiantProjet/raccordements';
    if (identifiantProjet) {
      return route.replace(':identifiantProjet', encodeURIComponent(identifiantProjet));
    } else {
      return route;
    }
  };

  static POST_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    const route = '/projet/:identifiantProjet/transmettre-demande-complete-raccordement';
    if (identifiantProjet) {
      return route.replace(':identifiantProjet', encodeURIComponent(identifiantProjet));
    } else {
      return route;
    }
  };

  static GET_TRANSMETTRE_DEMANDE_COMPLETE_RACCORDEMENT_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    const route = '/projet/:identifiantProjet/transmettre-demande-complete-raccordement.html';
    if (identifiantProjet) {
      return route.replace(':identifiantProjet', encodeURIComponent(identifiantProjet));
    } else {
      return route;
    }
  };

  static GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/transmettre-date-mise-en-service.html`;
  };

  static POST_TRANSMETTRE_DATE_MISE_EN_SERVICE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/transmettre-date-mise-en-service`;
  };

  static GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/transmettre-proposition-technique-et-financiere.html`;
  };

  static POST_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/transmettre-proposition-technique-et-financiere`;
  };

  static GET_DEMANDE_COMPLETE_RACCORDEMENT_FILE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/telecharger-accuse-reception`;
  };

  static GET_PROPOSITION_TECHNIQUE_ET_FINANCIERE_FILE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/telecharger-proposition-technique-et-financiere`;
  };

  static GET_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/modifier-demande-complete-raccordement.html`;
  };

  static POST_MODIFIER_DEMANDE_COMPLETE_RACCORDEMENT = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/modifier-demande-complete-raccordement`;
  };

  static GET_MODIFIER_GESTIONNAIRE_RESEAU_PROJET_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/modifier-gestionnaire-reseau.html`;
  };

  static POST_MODIFIER_GESTIONNAIRE_RESEAU_PROJET = (identifiantProjet?: RawIdentifiantProjet) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/modifier-gestionnaire-reseau`;
  };

  static GET_MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/modifier-proposition-technique-et-financiere.html`;
  };

  static POST_MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIERE = (
    identifiantProjet?: RawIdentifiantProjet,
    reference?: string,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/${
      reference ? encodeURIComponent(reference) : ':reference'
    }/modifier-proposition-technique-et-financiere`;
  };

  static GET_PAGE_RACCORDEMENT_SANS_DOSSIER_PAGE = (identifiantProjet?: RawIdentifiantProjet) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/raccordements/aucun-dossier-renseigne.html`;
  };
  static GET_IMPORTER_DATES_MISE_EN_SERVICE_PAGE = `/admin/importer-dates-mise-en-service.html`;
  static POST_IMPORTER_DATES_MISE_EN_SERVICE = `/admin/importer-dates-mise-en-service`;

  static GET_ENREGISTRER_GARANTIES_FINANCIERES_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/garanties-financieres.html`;
  };

  static GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/garanties-financieres/telecharger-attestation-constitution`;
  };

  static POST_ENREGISTRER_GARANTIES_FINANCIERES = (identifiantProjet?: RawIdentifiantProjet) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/garanties-financieres`;
  };

  static GET_DEPOSER_GARANTIES_FINANCIERES_PAGE = (identifiantProjet?: RawIdentifiantProjet) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/depot-garanties-financieres.html`;
  };

  static POST_DEPOSER_GARANTIES_FINANCIERES = (identifiantProjet?: RawIdentifiantProjet) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/depot-garanties-financieres`;
  };

  static GET_ATTESTATION_CONSTITUTION_GARANTIES_FINANCIERES_DEPOT = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/depot-garanties-financieres/telecharger-attestation-constitution`;
  };

  static GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/depot-garanties-financieres/modifier.html`;
  };

  static POST_MODIFIER_DEPOT_GARANTIES_FINANCIERES = (identifiantProjet?: RawIdentifiantProjet) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/depot-garanties-financieres/modifier`;
  };

  static POST_VALIDER_DEPOT_GARANTIES_FINANCIERES = (identifiantProjet?: RawIdentifiantProjet) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/depot-garanties-financieres/valider`;
  };

  static POST_SUPPRIMER_DEPOT_GARANTIES_FINANCIERES = (
    identifiantProjet?: RawIdentifiantProjet,
  ) => {
    return `/projet/${
      identifiantProjet ? encodeURIComponent(identifiantProjet) : ':identifiantProjet'
    }/depot-garanties-financieres/supprimer`;
  };

  static GET_LISTE_DEPOTS_GARANTIES_FINANCIERES_PAGE = () =>
    `/liste-depots-garanties-financieres.html`;
}
export default routes;
