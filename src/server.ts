const express = require('express')
const multer = require('multer')
const session = require('express-session')
import * as bodyParser from 'body-parser'

import makeExpressCallback from './helpers/makeExpressCallback'
import {
  getAdminLoginPage,
  getAdminDashboardPage,
  registerAuth,
  postLogin,
  ensureLoggedIn,
  postProjects
} from './controllers'

const app = express()
const port: number = 3000

const upload = multer({ dest: 'uploads/ ' })

app.use(express.static('src/public'))
app.use(session({ secret: 'cats' }))

app.use(bodyParser.urlencoded({ extended: false }))

const LOGIN_ROUTE = '/login.html'

registerAuth({
  app,
  loginRoute: LOGIN_ROUTE,
  successRoute: '/admin/dashboard.html'
})

const router = express.Router()

router.get(LOGIN_ROUTE, makeExpressCallback(getAdminLoginPage))

router.post('/login', postLogin()) // No makeExpressCallback as this uses a middleware
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get(
  '/admin/dashboard.html',
  ensureLoggedIn(),
  makeExpressCallback(getAdminDashboardPage)
)

router.post(
  '/importProjects',
  ensureLoggedIn(),
  upload.single('candidats'),
  makeExpressCallback(postProjects)
)

router.get('/admin/other.html', ensureLoggedIn(), function(req, res) {
  res.send('Other contents reserver to admins')
})

app.use(router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
