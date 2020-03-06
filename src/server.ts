import express from 'express'
import multer from 'multer'
import session from 'express-session'
import bodyParser from 'body-parser'

import makeExpressCallback from './helpers/makeExpressCallback'
import {
  getAdminLoginPage,
  getAdminDashboardPage,
  registerAuth,
  postLogin,
  ensureLoggedIn,
  postProjects,
  getSendCandidateNotifications
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

router.get(ROUTES.LOGIN, makeExpressCallback(getAdminLoginPage))

router.post(ROUTES.LOGIN_ACTION, postLogin()) // No makeExpressCallback as this uses a middleware
router.get(ROUTES.LOGOUT_ACTION, (req, res) => {
  req.logout()
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

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
