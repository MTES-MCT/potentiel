import * as express from 'express'
import * as session from 'express-session'
import * as bodyParser from 'body-parser'

import makeExpressCallback from './helpers/makeExpressCallback'
import makeAuthentication from './helpers/makeAuthentication'
import { getAdminLoginPage, getAdminDashboardPage } from './controllers'

const app = express()
const port: number = 3000

app.use(express.static('src/public'))
app.use(session({ secret: 'cats' }))
app.use(bodyParser.urlencoded({ extended: false }))

const LOGIN_ROUTE = '/admin/login.html'

const { authenticationHandler, ensureLoggedIn } = makeAuthentication({
  app,
  loginRoute: LOGIN_ROUTE,
  successRoute: '/admin/dashboard.html'
})

const router = express.Router()

router.get(LOGIN_ROUTE, makeExpressCallback(getAdminLoginPage))

router.post('/login', authenticationHandler)
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get(
  '/admin/dashboard.html',
  ensureLoggedIn(),
  makeExpressCallback(getAdminDashboardPage)
)

router.get('/admin/other.html', ensureLoggedIn(), function(req, res) {
  res.send('Other contents reserver to admins')
})

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
