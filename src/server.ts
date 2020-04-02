import express from 'express'
import multer from 'multer'
import session from 'express-session'
import bodyParser from 'body-parser'

import { version } from '../package.json'

import dotenv from 'dotenv'
dotenv.config()

import makeExpressCallback from './helpers/makeExpressCallback'
import {
  getLoginPage,
  getAdminDashboardPage,
  getAdminRequestsPage,
  getImportProjectsPage,
  getNotifyCandidatesPage,
  getUserDashboardPage,
  registerAuth,
  postLogin,
  ensureLoggedIn,
  logoutMiddleware,
  postProjects,
  postSendCandidateNotifications,
  getSignupPage,
  postSignup,
  getDemandePage,
  postRequestModification,
  getUserRequestsPage,
  getSendCopyOfCandidateNotification,
  getCandidateCertificate,
} from './controllers'

import { resetDbForTests } from './__tests__/integration/resetDbForTests'
import { addProjectsForTests } from './__tests__/integration/addProjectsForTests'

import { initDatabase } from './dataAccess'

import ROUTES from './routes'
import { User } from './entities'

export async function makeServer(port: number = 3000) {
  try {
    const app = express()

    const upload = multer({ dest: 'uploads/ ' })

    app.use(express.static('src/public'))
    app.use(session({ secret: 'cats' }))

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

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

      if (user.role === 'porteur-projet') {
        res.redirect(ROUTES.USER_DASHBOARD)
      }
    })

    router.get(ROUTES.LOGIN, makeExpressCallback(getLoginPage))

    router.post(ROUTES.LOGIN_ACTION, postLogin()) // No makeExpressCallback as this uses a middleware
    router.get(ROUTES.LOGOUT_ACTION, logoutMiddleware, (req, res) => {
      res.redirect('/')
    })

    router.get(
      ROUTES.ADMIN_DASHBOARD,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getAdminDashboardPage)
    )

    router.get(
      ROUTES.ADMIN_LIST_REQUESTS,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getAdminRequestsPage)
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
      ROUTES.ADMIN_SEND_COPY_OF_CANDIDATE_NOTIFICATION_ACTION(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getSendCopyOfCandidateNotification)
    )

    router.get(
      ROUTES.ADMIN_NOTIFY_CANDIDATES(),
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(getNotifyCandidatesPage)
    )

    router.post(
      ROUTES.ADMIN_NOTIFY_CANDIDATES_ACTION,
      ensureLoggedIn(),
      ensureRole(['admin', 'dgec']),
      makeExpressCallback(postSendCandidateNotifications)
    )

    // Going to the signup page automatically logs you out
    router.get(
      ROUTES.SIGNUP,
      /*logoutMiddleware,*/ makeExpressCallback(getSignupPage)
    )

    router.post(ROUTES.SIGNUP_ACTION, makeExpressCallback(postSignup))

    router.get(
      ROUTES.USER_DASHBOARD,
      ensureLoggedIn(),
      ensureRole('porteur-projet'),
      makeExpressCallback(getUserDashboardPage)
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
      ROUTES.USER_LIST_DEMANDES,
      ensureLoggedIn(),
      ensureRole('porteur-projet'),
      makeExpressCallback(getUserRequestsPage)
    )

    router.get(
      ROUTES.CANDIDATE_CERTIFICATE(),
      ensureLoggedIn(),
      makeExpressCallback(getCandidateCertificate)
    )

    router.get('/ping', (req, res) => {
      console.log('Call to ping')
      res.send('pong')
    })

    if (process.env.NODE_ENV === 'test') {
      router.get('/test/reset', makeExpressCallback(resetDbForTests))
      router.post('/test/addProjects', makeExpressCallback(addProjectsForTests))
    }

    app.use(router)

    // wait for the database to initialize
    await initDatabase()

    return new Promise((resolve) => {
      const server = app.listen(port, () => {
        console.log(`Server listening on port ${port}!`)
        console.log(`NODE_ENV is ${process.env.NODE_ENV}`)
        console.log(`Version ${version}`)
        resolve(server)
      })
    })
  } catch (error) {
    console.log('Error launching server', error)
  }
}

export * from './dataAccess'
