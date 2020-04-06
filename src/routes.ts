import { Project, ProjectAdmissionKey } from './entities'
import querystring from 'querystring'

const withProjectId = (url: string) => (projectId: Project['id']) =>
  url + (url.indexOf('?') === -1 ? '?' : '&') + 'projectId=' + projectId

const withParams = (url: string) => (params?: Record<string, any>) => {
  console.log('withParams for url', url, 'and params', params)

  if (!params) return url

  let priorQuery = {}
  if (url.indexOf('?') > -1) {
    priorQuery = querystring.parse(url.substring(url.indexOf('?')))
  }

  const newQueryString = querystring.stringify({ ...priorQuery, ...params })

  return url + (newQueryString.length ? '?' + newQueryString : '')
}

export default {
  LOGIN: '/login.html',
  LOGIN_ACTION: '/login',
  LOGOUT_ACTION: '/logout',
  REDIRECT_BASED_ON_ROLE: '/go-to-user-dashboard',
  SIGNUP: '/enregistrement.html',
  SIGNUP_ACTION: '/enregistrement',
  PROJECT_INVITATION: (
    projectAdmissionKey: ProjectAdmissionKey['id'],
    projectId: Project['id']
  ) =>
    `/enregistrement.html?projectAdmissionKey=${projectAdmissionKey}&projectId=${projectId}`,
  ADMIN_DASHBOARD: '/admin/dashboard.html',
  IMPORT_PROJECTS: '/admin/importer-candidats.html', // Keep separate from ADMIN_DASHBOARD, may change
  IMPORT_PROJECTS_ACTION: '/admin/importProjects',
  ADMIN_LIST_PROJECTS: '/admin/dashboard.html',
  ADMIN_LIST_REQUESTS: '/admin/demandes.html',
  ADMIN_NOTIFY_CANDIDATES: withParams('/admin/notifier-candidats.html'),
  CANDIDATE_CERTIFICATE: withProjectId('/admin/candidate-certificate.html'),
  SEND_NOTIFICATIONS_ACTION: '/admin/sendCandidateNotifications',
  USER_DASHBOARD: '/mes-projets.html',
  USER_LIST_PROJECTS: '/mes-projets.html',
  USER_LIST_DEMANDES: '/mes-demandes.html',
  DEPOSER_RECOURS: withProjectId('/deposer-recours.html'),
  TELECHARGER_ATTESTATION: withProjectId('/attestation.pdf'),
  // DEMANDE_DELAIS: withProjectId('/demande-delais.html'),
  // CHANGER_FOURNISSEUR: withProjectId('/changer-fournisseur.html'),
  // CHANGER_ACTIONNAIRE: withProjectId('/changer-actionnaire.html'),
  // CHANGER_PUISSANCE: withProjectId('/changer-puissance.html'),
  // DEMANDER_ABANDON: withProjectId('/abandon.html'),
  DEMANDE_GENERIQUE: '/demande-modification.html',
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
  DEMANDE_ACTION: '/soumettre-demande'
}
