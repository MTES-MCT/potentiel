import { makeCertificateFilename } from '@modules/project'
import querystring from 'querystring'
import sanitize from 'sanitize-filename'
import type { Project } from './entities'

const withParams =
  <T extends Record<string, any>>(url: string) =>
  (params?: T) => {
    if (!params) return url

    let priorQuery = {}
    if (url.indexOf('?') > -1) {
      priorQuery = querystring.parse(url.substring(url.indexOf('?') + 1))
    }

    const newQueryString = querystring.stringify({ ...priorQuery, ...params })

    return (
      (url.indexOf('?') === -1 ? url : url.substring(0, url.indexOf('?'))) +
      (newQueryString.length ? '?' + newQueryString.toString() : '')
    )
  }

const withProjectId = (url: string) => (projectId: Project['id']) => withParams(url)({ projectId })

export { withParams }

class routes {
  static HOME = '/'
  static LOGIN = '/login.html'
  static LOGIN_ACTION = '/login.html'
  static STATS = '/stats.html'
  static ABONNEMENT_LETTRE_INFORMATION = '/abonnement-lettre-information.html'
  static POST_SINSCRIRE_LETTRE_INFORMATION = '/s-inscrire-a-la-lettre-d-information'
  static LOGOUT_ACTION = '/logout'
  static SIGNUP = '/signup'

  static REDIRECT_BASED_ON_ROLE = '/go-to-user-dashboard'
  static ADMIN_DASHBOARD = '/admin/dashboard.html'
  static ADMIN_GARANTIES_FINANCIERES = '/admin/garanties-financieres.html'

  static ADMIN_AO_PERIODE = '/admin/appels-offres.html'
  static IMPORT_AO_ACTION = '/admin/importAppelsOffres'
  static IMPORT_PERIODE_ACTION = '/admin/importPeriodes'
  static EXPORT_AO_CSV = '/admin/appelsOffres.csv'
  static EXPORT_PERIODE_CSV = '/admin/periodes.csv'

  static UPLOAD_LEGACY_MODIFICATION_FILES = '/admin/importer-documents-historiques'

  static ADMIN_PARTNER_USERS = '/admin/utilisateurs-partenaires.html'
  static IMPORTER_LISTING_EDF = '/importer-donnees-producteurs-edf'
  static IMPORTER_LISTING_ENEDIS = '/importer-donnees-producteurs-enedis'

  static ADMIN_USERS = '/admin/utilisateurs.html'
  static ADMIN_INVITE_USER_ACTION = '/admin/inviterUtilisateur'
  static ADMIN_INVITE_DREAL_USER_ACTION = '/admin/inviterUtilisateurDreal'

  static USER_INVITATION = '/enregistrement.html'

  static IMPORT_PROJECTS_ACTION = '/admin/importer-candidats.html'
  static IMPORT_PROJECTS = '/admin/importer-candidats.html'

  static ADMIN_STATISTIQUES = '/admin/statistiques.html'
  static ADEME_STATISTIQUES = '/ademe/statistiques.html'

  static PROJECT_DETAILS = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/details.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }

  static CHOISIR_CAHIER_DES_CHARGES = (projetId?: Project['id']) => {
    const route = '/projet/:projetId/choisir-cahier-des-charges.html'
    if (projetId) {
      return route.replace(':projetId', projetId)
    } else return route
  }

  static DOWNLOAD_PROJECTS_CSV = '/export-projets.csv'
  static ADMIN_DOWNLOAD_PROJECTS_LAUREATS_CSV = '/export-projets-laureats.csv'
  static ADMIN_LIST_PROJECTS = '/admin/dashboard.html'
  static ADMIN_LIST_REQUESTS = '/admin/demandes.html'
  static ADMIN_REGENERATE_CERTIFICATES = '/admin/regenerer-attestations.html'
  static ADMIN_REGENERATE_CERTIFICATES_ACTION = '/admin/regenerer-attestations'
  static ADMIN_NOTIFY_CANDIDATES = withParams<{
    appelOffreId: string
    periodeId: string
  }>('/admin/notifier-candidats.html')

  static PREVIEW_CANDIDATE_CERTIFICATE = (project?: {
    id: string
    email: string
    potentielIdentifier: string
  }) => {
    const route = '/previsualiser-attestation/:projectId/:document'
    if (project) {
      return route
        .replace(':projectId', project.id)
        .replace(':document', 'aperçu-' + makeCertificateFilename({ ...project, forAdmin: true }))
    } else return route
  }

  static DOWNLOAD_CERTIFICATE_FILE = (projectId?: string, fileId?: string, filename?: string) => {
    const route = '/attestation/:projectId/:fileId/:filename'
    if (projectId && fileId && filename) {
      return route
        .replace(':projectId', projectId)
        .replace(':fileId', fileId)
        .replace(':filename', filename)
    } else return route
  }

  static CANDIDATE_CERTIFICATE_FOR_ADMINS = (project: {
    id: string
    certificateFileId: string
    email: string
    potentielIdentifier: string
  }) =>
    routes.DOWNLOAD_CERTIFICATE_FILE(
      project.id,
      project.certificateFileId,
      makeCertificateFilename({ ...project, forAdmin: true })
    )

  static CANDIDATE_CERTIFICATE_FOR_CANDIDATES = (project: {
    id: string
    certificateFileId: string
    nomProjet: string
    potentielIdentifier: string
  }) =>
    routes.DOWNLOAD_CERTIFICATE_FILE(
      project.id,
      project.certificateFileId,
      makeCertificateFilename({ ...project, forAdmin: false })
    )

  static ADMIN_NOTIFY_CANDIDATES_ACTION = '/admin/sendCandidateNotifications'
  static ADMIN_CORRECT_PROJECT_DATA_ACTION = '/admin/correctProjectData'
  static ADMIN_REPLY_TO_MODIFICATION_REQUEST = '/admin/replyToModificationRequest'
  static ADMIN_ACCORDER_OU_REJETER_DEMANDE_DELAI = '/admin/accorder-ou-rejeter-demande-delai'
  static ADMIN_REPONDRE_DEMANDE_ABANDON = '/admin/repondre-demande-abandon'

  static ADMIN_ANNULER_DELAI_REJETE = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/annuler-rejet-demande-delai'
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId)
    } else return route
  }

  static ADMIN_ANNULER_ABANDON_REJETE = '/admin/demande/annuler-rejet-demande-abandon'

  static ADMIN_ANNULER_RECOURS_REJETE = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/annuler-rejet-demande-recours'
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId)
    } else return route
  }

  static ADMIN_ANNULER_CHANGEMENT_DE_PUISSANCE_REJETE =
    '/admin/demande/annuler-rejet-demande-changement-de-puissance'

  static ADMIN_DREAL_LIST = '/admin/dreals.html'
  static ADMIN_INVITATION_LIST = '/admin/invitations.html'
  static ADMIN_INVITATION_RELANCE_ACTION = '/admin/relanceInvitations'
  static ADMIN_NOTIFICATION_LIST = '/admin/notifications.html'
  static ADMIN_NOTIFICATION_RETRY_ACTION = '/admin/retryNotifications'

  static ADMIN_SIGNALER_DEMANDE_DELAI_PAGE = (projectId?: Project['id']) => {
    const route = '/admin/projet/:projectId/signalerDemandeDelai.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }
  static ADMIN_SIGNALER_DEMANDE_DELAI_POST = '/admin/signalerDemandeDelai'

  static ADMIN_SIGNALER_DEMANDE_ABANDON_PAGE = (projectId?: Project['id']) => {
    const route = '/admin/projet/:projectId/signalerDemandeAbandon.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }
  static ADMIN_SIGNALER_DEMANDE_ABANDON_POST = '/admin/signalerDemandeAbandon'

  static ADMIN_SIGNALER_DEMANDE_RECOURS_PAGE = (projectId?: Project['id']) => {
    const route = '/admin/projet/:projectId/signalerDemandeRecours.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }
  static ADMIN_SIGNALER_DEMANDE_RECOURS_POST = '/admin/signalerDemandeRecours'

  static ADMIN_PASSER_DEMANDE_DELAI_EN_INSTRUCTION = (args?: { modificationRequestId: string }) => {
    const route = '/admin/demande/:modificationRequestId/passer-demande-delai-en-instruction'
    if (args) {
      return route.replace(':modificationRequestId', args.modificationRequestId)
    } else return route
  }

  static SUCCESS_OR_ERROR_PAGE = withParams<{
    success?: string
    error?: string
    redirectUrl?: string
    redirectTitle?: string
  }>('/confirmation.html')

  static USER_DASHBOARD = '/mes-projets.html'
  static USER_LIST_PROJECTS = '/mes-projets.html'
  static USER_LIST_MISSING_OWNER_PROJECTS = '/projets-a-reclamer.html'
  static USER_CLAIM_PROJECTS = '/reclamer-propriete-projets.html'
  static USER_LIST_REQUESTS = '/mes-demandes.html'
  static DEMANDE_GENERIQUE = '/demande-modification.html'
  static DEPOSER_RECOURS = withProjectId('/demande-modification.html?action=recours')

  static DEMANDER_DELAI = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/demander-delai.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }

  static DEMANDER_ABANDON = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/demander-abandon.html'
    return projectId ? route.replace(':projectId', projectId) : route
  }

  static CHANGER_PRODUCTEUR = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/changer-producteur.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }

  static CHANGER_FOURNISSEUR = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/changer-fournisseur.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }

  static CHANGER_ACTIONNAIRE = withProjectId('/demande-modification.html?action=actionnaire')

  static CHANGER_PUISSANCE = withProjectId('/demande-modification.html?action=puissance')

  static CHANGER_CDC = '/changer-CDC'

  static DEMANDE_ACTION = '/soumettre-demande'

  static DEMANDE_DELAI_ACTION = '/soumettre-demande-delai'

  static CONFIRMER_DEMANDE_ABANDON = '/confirmer-demande-abandon'

  static ANNULER_DEMANDE_ACTION = '/annuler-demande'
  static ANNULER_DEMANDE_DELAI = '/annuler-demande-delai'

  static DEMANDE_ABANDON_ACTION = '/soumettre-demande-abandon'
  static ANNULER_DEMANDE_ABANDON_ACTION = '/annuler-demande-abandon'
  static ACCORDER_DEMANDE_ABANDON_ACTION = '/annuler-demande-abandon'

  static CHANGEMENT_PRODUCTEUR_ACTION = '/soumettre-changement-producteur'
  static CHANGEMENT_FOURNISSEUR_ACTION = '/soumettre-changement-fournisseur'

  static DOWNLOAD_PROJECT_FILE = (fileId?: string, filename?: string) => {
    const route = '/telechargement/:fileId/fichier/:filename'
    if (fileId && filename) {
      return route.replace(':fileId', fileId).replace(':filename', filename)
    } else return route
  }

  static DEMANDE_PAGE_DETAILS = (modificationRequestId?: string) => {
    const route = '/demande/:modificationRequestId/details.html'
    if (modificationRequestId) {
      return route.replace(':modificationRequestId', modificationRequestId)
    } else return route
  }

  static INVITE_USER_TO_PROJECT_ACTION = '/invite-user-to-project'

  static DEPOSER_ETAPE_ACTION = '/deposer-etape'
  static SUPPRIMER_ETAPE_ACTION = (args?: { projectId: string; type: string }) => {
    const route = '/projet/:projectId/supprimer/:type'
    if (args) {
      const { type, projectId } = args
      return route.replace(':projectId', projectId).replace(':type', type)
    } else return route
  }

  /* CRE4 GF */
  static REMOVE_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/annuler-depot/garanties-financieres'
    if (args) {
      const { projectId } = args
      return route.replace(':projectId', projectId)
    } else return route
  }
  static SUBMIT_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/deposer/garanties-financieres'
    if (args) {
      const { projectId } = args
      return route.replace(':projectId', projectId)
    } else return route
  }

  /* PPE2 GF */
  static WITHDRAW_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/supprimer/garanties-financieres'
    if (args) {
      const { projectId } = args
      return route.replace(':projectId', projectId)
    } else return route
  }
  static UPLOAD_GARANTIES_FINANCIERES = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/enregistrer/garanties-financieres'
    if (args) {
      const { projectId } = args
      return route.replace(':projectId', projectId)
    } else return route
  }

  static ADD_GF_EXPIRATION_DATE = (args?: { projectId: string }) => {
    const route = '/projet/:projectId/actualiser/garanties-financieres'
    if (args) {
      const { projectId } = args
      return route.replace(':projectId', projectId)
    } else return route
  }

  static UPDATE_PROJECT_STEP_STATUS = (args?: {
    projectId: string
    newStatus: 'à traiter' | 'validé'
    projectStepId: string
  }) => {
    const route = '/projet/:projectId/etape-projet/:projectStepId/statut/:newStatus'

    if (args) {
      const { newStatus, projectId, projectStepId } = args
      return route
        .replace(':projectId', projectId)
        .replace(':newStatus', newStatus)
        .replace(':projectStepId', projectStepId)
    }

    return route
  }

  static TELECHARGER_MODELE_MISE_EN_DEMEURE = (project?: { id: string; nomProjet: string }) => {
    const route = '/projet/:projectId/telecharger-mise-en-demeure/:filename'
    if (project) {
      return route
        .replace(':projectId', project.id)
        .replace(
          ':filename',
          sanitize(`Mise en demeure Garanties Financières - ${project.nomProjet}.docx`)
        )
    } else return route
  }

  static TELECHARGER_MODELE_REPONSE = (
    project?: { potentielIdentifier: string; id: string },
    modificationRequestId?: string
  ) => {
    const route = '/projet/:projectId/demande/:modificationRequestId/telecharger-reponse/:filename'
    if (project && modificationRequestId) {
      const now = new Date()
      return route
        .replace(':projectId', project.id)
        .replace(':modificationRequestId', modificationRequestId)
        .replace(
          ':filename',
          sanitize(
            `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} - Réponse demande - ${
              project.potentielIdentifier
            }.docx`
          )
        )
    } else return route
  }

  static REVOKE_USER_RIGHTS_TO_PROJECT_ACTION = withParams<{
    projectId: string
    userId: string
  }>('/retirer-droits')

  static ATTACHER_FICHIER_AU_PROJET_ACTION = '/attacher-fichier-au-projet'
  static RETIRER_FICHIER_DU_PROJET_ACTION = '/retirer-fichier-du-projet'

  static IMPORT_DONNEES_RACCORDEMENT = '/admin/import-données-raccordement.html'
  static POST_DEMARRER_IMPORT_DONNEES_RACCORDEMENT = '/admin/demarrer-import-données-raccordement'
}

export default routes
