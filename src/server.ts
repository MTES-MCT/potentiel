import express from 'express'
import multer from 'multer'
import session from 'express-session'
import bodyParser from 'body-parser'

import makeExpressCallback from './helpers/makeExpressCallback'
import {
  getLoginPage,
  getAdminDashboardPage,
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

const app = express()
const port: number = 3000

const upload = multer({ dest: 'uploads/ ' })

app.use(express.static('src/public'))
app.use(session({ secret: 'cats' }))

app.use(bodyParser.urlencoded({ extended: false }))

registerAuth({
  app,
  loginRoute: ROUTES.LOGIN,
  successRoute: ROUTES.ADMIN_DASHBOARD
})

const router = express.Router()

router.get(ROUTES.LOGIN, makeExpressCallback(getLoginPage))

router.post(ROUTES.LOGIN_ACTION, postLogin()) // No makeExpressCallback as this uses a middleware
router.get(ROUTES.LOGOUT_ACTION, logoutMiddleware, (req, res) => {
  res.redirect('/')
})

router.get(
  ROUTES.ADMIN_DASHBOARD,
  ensureLoggedIn(),
  makeExpressCallback(getAdminDashboardPage)
)

router.post(
  ROUTES.IMPORT_PROJECTS_ACTION,
  ensureLoggedIn(),
  upload.single('candidats'),
  makeExpressCallback(postProjects)
)

router.get(
  ROUTES.SEND_NOTIFICATIONS_ACTION,
  ensureLoggedIn(),
  makeExpressCallback(getSendCandidateNotifications)
)
router.get(
  ROUTES.CANDIDATE_NOTIFICATION,
  ensureLoggedIn(),
  makeExpressCallback(getCandidateNotification)
)

// Going to the signup page automatically logs you out
router.get(
  ROUTES.SIGNUP,
  /*logoutMiddleware,*/ makeExpressCallback(getSignupPage)
)

router.post(ROUTES.SIGNUP_ACTION, makeExpressCallback(postSignup))

router.get(ROUTES.USER_DASHBOARD, ensureLoggedIn(), (req, res) => {
  res.send('User dashboard success')
})

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
