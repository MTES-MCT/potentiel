import express from 'express'
import multer from 'multer'
import session from 'express-session'
import bodyParser from 'body-parser'

import makeExpressCallback from './helpers/makeExpressCallback'
import {
  getLoginPage,
  getAdminDashboardPage,
  getUserDashboardPage,
  registerAuth,
  postLogin,
  ensureLoggedIn,
  logoutMiddleware,
  postProjects,
  getSendCandidateNotifications,
  getCandidateNotification,
  getSignupPage,
  postSignup
} from './controllers'

import ROUTES from './routes'
import { User } from './entities'

const app = express()
const port: number = 3000

const upload = multer({ dest: 'uploads/ ' })

app.use(express.static('src/public'))
app.use(session({ secret: 'cats' }))

app.use(bodyParser.urlencoded({ extended: false }))

registerAuth({
  app,
  loginRoute: ROUTES.LOGIN,
  successRoute: ROUTES.REDIRECT_BASED_ON_ROLE
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

router.post(
  ROUTES.IMPORT_PROJECTS_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  upload.single('candidats'),
  makeExpressCallback(postProjects)
)

router.get(
  ROUTES.SEND_NOTIFICATIONS_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  makeExpressCallback(getSendCandidateNotifications)
)
router.get(
  ROUTES.CANDIDATE_NOTIFICATION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  makeExpressCallback(getCandidateNotification)
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

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
