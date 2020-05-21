import { Project, ProjectAdmissionKey, AppelOffre } from './entities'
import querystring from 'querystring'
import { string } from 'yup'
import sanitize from 'sanitize-filename'

const withParams = <T extends Record<string, any>>(url: string) => (
  params?: T
) => {
  // console.log('withParams for url', url, 'and params', params)

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

const withProjectId = (url: string) => (projectId: Project['id']) =>
  withParams(url)({ projectId })

export { withParams }

class routes {
  static HOME = '/'
  static LOGIN = '/login.html'
  static LOGIN_ACTION = '/login'
  static LOGOUT_ACTION = '/logout'
  static FORGOTTEN_PASSWORD = '/mot-de-passe-oublie.html'
  static FORGOTTEN_PASSWORD_ACTION = '/retrieve-password'
  static RESET_PASSWORD_LINK = withParams<{
    resetCode: string
  }>('/recuperation-mot-de-passe.html')
  static RESET_PASSWORD_ACTION = '/reset-password'
  static REDIRECT_BASED_ON_ROLE = '/go-to-user-dashboard'
  static SIGNUP = '/enregistrement.html'
  static SIGNUP_ACTION = '/enregistrement'
  static PROJECT_INVITATION = withParams<{
    projectAdmissionKey: string
  }>('/enregistrement.html')
  static ADMIN_DASHBOARD = '/admin/dashboard.html'
  static IMPORT_PROJECTS = '/admin/importer-candidats.html' // Keep separate from ADMIN_DASHBOARD, may change

  static PROJECT_DETAILS = (projectId?: Project['id']) => {
    const route = '/projet/:projectId/details.html'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  }

  static IMPORT_PROJECTS_ACTION = '/admin/importProjects'
  static ADMIN_LIST_PROJECTS = '/admin/dashboard.html'
  static ADMIN_LIST_REQUESTS = '/admin/demandes.html'
  static ADMIN_SEND_COPY_OF_CANDIDATE_NOTIFICATION_ACTION = withParams<{
    appelOffreId: string
    periodeId: string
    email: string
  }>('/admin/sendCopyOfCandidateNotification')
  static ADMIN_NOTIFY_CANDIDATES = withParams<{
    appelOffreId: string
    periodeId: string
  }>('/admin/notifier-candidats.html')

  static CANDIDATE_CERTIFICATE = (
    projectId?: Project['id'],
    filename?: string
  ) => {
    const route = '/telechargement/:projectId/attestation/*.pdf'
    if (projectId) {
      return route
        .replace(':projectId', projectId)
        .replace('*', filename || 'attestation')
    } else return route
  }

  static CANDIDATE_CERTIFICATE_FOR_ADMINS = (project: Project) =>
    routes.CANDIDATE_CERTIFICATE(
      project.id,
      sanitize(`attestation-${project.email}`)
    )

  static CANDIDATE_CERTIFICATE_FOR_CANDIDATES = (project: Project) =>
    routes.CANDIDATE_CERTIFICATE(
      project.id,
      sanitize(
        `${project.appelOffre?.id || 'AO'}-P${project.periodeId}-F${
          project.familleId
        }-${project.nomProjet}`
      )
    )

  static ADMIN_NOTIFY_CANDIDATES_ACTION = '/admin/sendCandidateNotifications'
  static USER_DASHBOARD = '/mes-projets.html'
  static USER_LIST_PROJECTS = '/mes-projets.html'
  static USER_LIST_DEMANDES = '/mes-demandes.html'
  static DEMANDE_GENERIQUE = '/demande-modification.html'
  static DEPOSER_RECOURS = withProjectId(
    '/demande-modification.html?action=recours'
  )
  static DEMANDE_DELAIS = withProjectId(
    '/demande-modification.html?action=delai'
  )
  static CHANGER_FOURNISSEUR = withProjectId(
    '/demande-modification.html?action=fournisseur'
  )
  static CHANGER_ACTIONNAIRE = withProjectId(
    '/demande-modification.html?action=actionnaire'
  )
  static CHANGER_PUISSANCE = withProjectId(
    '/demande-modification.html?action=puissance'
  )
  static CHANGER_PRODUCTEUR = withProjectId(
    '/demande-modification.html?action=producteur'
  )
  static DEMANDER_ABANDON = withProjectId(
    '/demande-modification.html?action=abandon'
  )
  static DEMANDE_ACTION = '/soumettre-demande'
  static DOWNLOAD_PROJECT_FILE = (
    projectId?: Project['id'],
    filename?: string
  ) => {
    const route = '/telechargement/:projectId/fichier/:filename'
    if (projectId && filename) {
      return route
        .replace(':projectId', projectId)
        .replace(':filename', filename)
    } else return route
  }

  static INVITE_USER_TO_PROJECT_ACTION = '/invite-user-to-project'

  static DEPOSER_GARANTIES_FINANCIERES_ACTION = '/deposer-garanties-financieres'
}

export default routes
