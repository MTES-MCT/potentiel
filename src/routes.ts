import { Project, ProjectAdmissionKey } from './entities'
import querystring from 'querystring'
import { string } from 'yup'

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

export default {
  HOME: '/',
  LOGIN: '/login.html',
  LOGIN_ACTION: '/login',
  LOGOUT_ACTION: '/logout',
  REDIRECT_BASED_ON_ROLE: '/go-to-user-dashboard',
  SIGNUP: '/enregistrement.html',
  SIGNUP_ACTION: '/enregistrement',
  PROJECT_INVITATION: withParams<{
    projectAdmissionKey: string
  }>('/enregistrement.html'),
  ADMIN_DASHBOARD: '/admin/dashboard.html',
  IMPORT_PROJECTS: '/admin/importer-candidats.html', // Keep separate from ADMIN_DASHBOARD, may change
  IMPORT_PROJECTS_ACTION: '/admin/importProjects',
  ADMIN_LIST_PROJECTS: '/admin/dashboard.html',
  ADMIN_LIST_REQUESTS: '/admin/demandes.html',
  ADMIN_SEND_COPY_OF_CANDIDATE_NOTIFICATION_ACTION: withParams<{
    appelOffreId: string
    periodeId: string
    email: string
  }>('/admin/sendCopyOfCandidateNotification'),
  ADMIN_NOTIFY_CANDIDATES: withParams<{
    appelOffreId: string
    periodeId: string
  }>('/admin/notifier-candidats.html'),
  CANDIDATE_CERTIFICATE: (projectId?: Project['id']) => {
    const route = '/telechargement/:projectId/attestation.pdf'
    if (projectId) {
      return route.replace(':projectId', projectId)
    } else return route
  },
  ADMIN_NOTIFY_CANDIDATES_ACTION: withParams<{
    appelOffreId: string
    periodeId: string
  }>('/admin/sendCandidateNotifications'),
  USER_DASHBOARD: '/mes-projets.html',
  USER_LIST_PROJECTS: '/mes-projets.html',
  USER_LIST_DEMANDES: '/mes-demandes.html',
  DEMANDE_GENERIQUE: '/demande-modification.html',
  DEPOSER_RECOURS: withProjectId('/demande-modification.html?action=recours'),
  DEMANDE_DELAIS: withProjectId('/demande-modification.html?action=delai'),
  CHANGER_FOURNISSEUR: withProjectId(
    '/demande-modification.html?action=fournisseur'
  ),
  CHANGER_ACTIONNAIRE: withProjectId(
    '/demande-modification.html?action=actionnaire'
  ),
  CHANGER_PUISSANCE: withProjectId(
    '/demande-modification.html?action=puissance'
  ),
  CHANGER_PRODUCTEUR: withProjectId(
    '/demande-modification.html?action=producteur'
  ),
  DEMANDER_ABANDON: withProjectId('/demande-modification.html?action=abandon'),
  DEMANDE_ACTION: '/soumettre-demande',
}
