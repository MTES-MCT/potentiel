import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import multer from 'multer'
import { version } from '../package.json'
import {
  ensureLoggedIn,
  getCandidateCertificatePreview,
  getDemandePage,
  getDrealPage,
  getForgottenPasswordPage,
  getGarantiesFinancieresPage,
  getImportProjectsPage,
  getInvitationListPage,
  getLoginPage,
  getModeleMiseEnDemeure,
  getModeleReponseRecours,
  getModificationRequestListPage,
  getModificationRequestPage,
  getNotificationListPage,
  getNotifyCandidatesPage,
  getProjectCertificateFile,
  getProjectFile,
  getProjectListPage,
  getProjectPage,
  getRemoveDCR,
  getRemoveGarantiesFinancieres,
  getResetPasswordPage,
  getSignupPage,
  getStatistiquesPage,
  logoutMiddleware,
  postCorrectProjectData,
  postDCR,
  postGarantiesFinancieres,
  postInviteDreal,
  postInviteUserToProject,
  postLogin,
  postProjects,
  postRelanceGarantiesFinancieres,
  postRelanceInvitations,
  postReplyToModificationRequest,
  postRequestModification,
  postResetPassword,
  postRetrievePassword,
  postRetryNotifications,
  postSendCandidateNotifications,
  postSignup,
  registerAuth,
} from './controllers'
import { initDatabase } from './dataAccess'
import { User } from './entities'
import makeExpressCallback from './helpers/makeExpressCallback'
import ROUTES from './routes'
import {
  addInvitationsForTests,
  addNotificationsForTests,
  addProjectsForTests,
  addUserToDrealForTests,
  checkUserAccessToProjectForTests,
  createInvitationForTests,
  createUserWithEmailForTests,
  getProjectHistoryForTests,
  getProjectIdForTests,
  getSentEmailsForTests,
  resetDbForTests,
} from './__tests__/integration'

import { logger } from './core/utils'
dotenv.config()

const FILE_SIZE_LIMIT_MB = 50

export async function makeServer(port: number) {
  try {
    const app = express()

    const upload = multer({
      dest: 'temp',
      limits: { fileSize: FILE_SIZE_LIMIT_MB * 1024 * 1024 /* MB */ },
    })

    app.use(express.static('src/public'))
    app.use(session({ secret: 'SD7654fsddxc34fsdfsd7è"("SKSRBIOP6FDFf' }))

    app.use(
      bodyParser.urlencoded({
        extended: false,
        limit: FILE_SIZE_LIMIT_MB + 'mb',
      })
    )
    app.use(bodyParser.json({ limit: FILE_SIZE_LIMIT_MB + 'mb' }))

    app.use(cookieParser())

    registerAuth({
      app,
      loginRoute: ROUTES.LOGIN,
      successRoute: ROUTES.REDIRECT_BASED_ON_ROLE,
    })

    const router = express.Router()

    const ensureRole = (roles: string | Array<string>) => (req, res, next) => {
      const user = req.user as User

      if (!user) {
        return res.redirect(ROUTES.LOGIN)
      }

      if (typeof roles === 'string') {
        if (user.role !== roles) {
          return res.redirect(ROUTES.REDIRECT_BASED_ON_ROLE)
        }
      } else {
        if (!roles.includes(user.role)) {
          return res.redirect(ROUTES.REDIRECT_BASED_ON_ROLE)
        }
      }

      // Ok to move forward
      next()
    }

    router.get(ROUTES.REDIRECT_BASED_ON_ROLE, ensureLoggedIn(), (req, res) => {
      const user = req.user as User

      if (user.role === 'admin' || user.role === 'dgec') {
        res.redirect(ROUTES.ADMIN_DASHBOARD)
      }

      if (user.role === 'dreal') {
        res.redirect(ROUTES.GARANTIES_FINANCIERES_LIST)
      }

      if (user.role === 'porteur-projet') {
        res.redirect(ROUTES.USER_DASHBOARD)
      }
    })

    router.get(ROUTES.LOGIN, makeExpressCallback(getLoginPage))

    router.get(ROUTES.STATS, makeExpressCallback(getStatistiquesPage))

    router.post(ROUTES.LOGIN_ACTION, postLogin()) // No makeExpressCallback as this uses a middleware
    router.get(ROUTES.LOGOUT_ACTION, logoutMiddleware, (req, res) => {
      res.redirect('/')
    })

    router.get(ROUTES.FORGOTTEN_PASSWORD, makeExpressCallback(getForgottenPasswordPage))
    router.post(ROUTES.FORGOTTEN_PASSWORD_ACTION, makeExpressCallback(postRetrievePassword))
    router.get(ROUTES.RESET_PASSWORD_LINK(), makeExpressCallback(getResetPasswordPage))
    router.post(ROUTES.RESET_PASSWORD_ACTION, makeExpressCallback(postResetPassword))

    router.get(
      ROUTES.ADMIN_DASHBOARD,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec', 'dreal']),
      makeExpressCallback(getProjectListPage)
    )

    router.get(
      ROUTES.ADMIN_LIST_REQUESTS,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getModificationRequestListPage)
    )

    router.get(
      ROUTES.IMPORT_PROJECTS,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getImportProjectsPage)
    )

    router.post(
      ROUTES.IMPORT_PROJECTS_ACTION,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      upload.single('candidats'),
      makeExpressCallback(postProjects)
    )

    router.get(
      ROUTES.ADMIN_NOTIFY_CANDIDATES(),
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getNotifyCandidatesPage)
    )

    router.post(
      ROUTES.ADMIN_CORRECT_PROJECT_DATA_ACTION,
      ensureLoggedIn(),
      upload.single('file'),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(postCorrectProjectData)
    )

    router.post(
      ROUTES.ADMIN_REPLY_TO_MODIFICATION_REQUEST,
      ensureLoggedIn(),
      upload.single('file'),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(postReplyToModificationRequest)
    )

    router.post(
      ROUTES.ADMIN_NOTIFY_CANDIDATES_ACTION,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(postSendCandidateNotifications)
    )

    router.get(ROUTES.PROJECT_DETAILS(), ensureLoggedIn(), makeExpressCallback(getProjectPage))

    // Going to the signup page automatically logs you out
    router.get(ROUTES.SIGNUP, /* logoutMiddleware, */ makeExpressCallback(getSignupPage))

    router.post(ROUTES.SIGNUP_ACTION, makeExpressCallback(postSignup))

    router.get(
      ROUTES.USER_DASHBOARD,
      ensureLoggedIn(),
      ensureRole('porteur-projet'),
      makeExpressCallback(getProjectListPage)
    )

    router.get(
      ROUTES.DEMANDE_GENERIQUE,
      ensureLoggedIn(),
      ensureRole('porteur-projet'),
      makeExpressCallback(getDemandePage)
    )

    router.post(
      ROUTES.DEMANDE_ACTION,
      ensureLoggedIn(),
      ensureRole('porteur-projet'),
      upload.single('file'),
      makeExpressCallback(postRequestModification)
    )

    router.get(
      ROUTES.USER_LIST_REQUESTS,
      ensureLoggedIn(),
      ensureRole('porteur-projet'),
      makeExpressCallback(getModificationRequestListPage)
    )

    router.get(
      ROUTES.PREVIEW_CANDIDATE_CERTIFICATE(),
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getCandidateCertificatePreview)
    )

    router.get(
      ROUTES.DEMANDE_PAGE_DETAILS(),
      ensureLoggedIn(),
      makeExpressCallback(getModificationRequestPage)
    )

    router.get(
      ROUTES.DOWNLOAD_PROJECT_FILE(),
      ensureLoggedIn(),
      makeExpressCallback(getProjectFile)
    )

    router.get(
      ROUTES.DOWNLOAD_CERTIFICATE_FILE(),
      ensureLoggedIn(),
      makeExpressCallback(getProjectCertificateFile)
    )

    router.post(
      ROUTES.INVITE_USER_TO_PROJECT_ACTION,
      ensureLoggedIn(),
      makeExpressCallback(postInviteUserToProject)
    )

    router.post(
      ROUTES.DEPOSER_GARANTIES_FINANCIERES_ACTION,
      ensureLoggedIn(),
      upload.single('file'),
      makeExpressCallback(postGarantiesFinancieres)
    )
    router.get(
      ROUTES.SUPPRIMER_GARANTIES_FINANCIERES_ACTION(),
      ensureLoggedIn(),
      makeExpressCallback(getRemoveGarantiesFinancieres)
    )
    router.get(
      ROUTES.TELECHARGER_MODELE_MISE_EN_DEMEURE(),
      ensureLoggedIn(),
      makeExpressCallback(getModeleMiseEnDemeure)
    )
    router.get(
      ROUTES.TELECHARGER_MODELE_REPONSE_RECOURS(),
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getModeleReponseRecours)
    )

    router.post(
      ROUTES.DEPOSER_DCR_ACTION,
      ensureLoggedIn(),
      upload.single('file'),
      makeExpressCallback(postDCR)
    )

    router.get(ROUTES.SUPPRIMER_DCR_ACTION(), ensureLoggedIn(), makeExpressCallback(getRemoveDCR))

    router.get(
      ROUTES.ADMIN_DREAL_LIST,
      ensureLoggedIn(),
      ensureRole('admin'),
      makeExpressCallback(getDrealPage)
    )

    router.post(
      ROUTES.ADMIN_INVITE_DREAL_ACTION,
      ensureLoggedIn(),
      ensureRole('admin'),
      makeExpressCallback(postInviteDreal)
    )

    router.get(
      ROUTES.GARANTIES_FINANCIERES_LIST,
      ensureLoggedIn(),
      ensureRole(['admin', 'dreal']),
      makeExpressCallback(getGarantiesFinancieresPage)
    )

    router.get(
      ROUTES.ADMIN_INVITATION_LIST,
      ensureLoggedIn(),
      ensureRole(['admin']),
      makeExpressCallback(getInvitationListPage)
    )

    router.post(
      ROUTES.ADMIN_INVITATION_RELANCE_ACTION,
      ensureLoggedIn(),
      ensureRole(['admin']),
      makeExpressCallback(postRelanceInvitations)
    )

    router.get(
      ROUTES.ADMIN_NOTIFICATION_LIST,
      ensureLoggedIn(),
      ensureRole(['admin']),
      makeExpressCallback(getNotificationListPage)
    )

    router.post(
      ROUTES.ADMIN_NOTIFICATION_RETRY_ACTION,
      ensureLoggedIn(),
      ensureRole(['admin']),
      makeExpressCallback(postRetryNotifications)
    )

    router.get('/ping', (req, res) => {
      logger.info('Call to ping')
      res.send('pong')
    })

    router.post(
      '/cron/relanceGarantiesFinancieres',
      makeExpressCallback(postRelanceGarantiesFinancieres)
    )

    if (process.env.NODE_ENV === 'test') {
      router.get('/test/reset', makeExpressCallback(resetDbForTests))
      router.post('/test/addProjects', makeExpressCallback(addProjectsForTests))
      router.post('/test/createInvitation', makeExpressCallback(createInvitationForTests))
      router.get('/test/getSentEmails', makeExpressCallback(getSentEmailsForTests))
      router.post(
        '/test/checkUserAccessToProject',
        makeExpressCallback(checkUserAccessToProjectForTests)
      )
      router.post('/test/createUserWithEmail', makeExpressCallback(createUserWithEmailForTests))
      router.get('/test/getProjectId', makeExpressCallback(getProjectIdForTests))
      router.get('/test/getProject', makeExpressCallback(getProjectHistoryForTests))

      router.post('/test/addUserToDreal', makeExpressCallback(addUserToDrealForTests))

      router.post('/test/addInvitations', makeExpressCallback(addInvitationsForTests))
      router.post('/test/addNotifications', makeExpressCallback(addNotificationsForTests))
    }

    app.use(router)

    // wait for the database to initialize
    await initDatabase()

    return new Promise((resolve) => {
      const server = app.listen(port, () => {
        logger.info(`Server listening on port ${port}!`)
        logger.info(`NODE_ENV is ${process.env.NODE_ENV}`)
        logger.info(`Version ${version}`)
        resolve(server)
      })
    })
  } catch (error) {
    logger.error(error)
  }
}

export * from './dataAccess'
