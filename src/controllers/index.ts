import makeGetAdminLoginPage from './getAdminLoginPage'
import makeGetAdminDashboardPage from './getAdminDashboardPage'
import makeAuthentication from './authentication'

import { userAccess } from '../dataAccess'

const getAdminLoginPage = makeGetAdminLoginPage()
const getAdminDashboardPage = makeGetAdminDashboardPage()
const { registerAuth, postLogin, ensureLoggedIn } = makeAuthentication({
  findUserById: userAccess.findById
})

const controller = Object.freeze({
  getAdminLoginPage,
  getAdminDashboardPage,
  registerAuth,
  postLogin,
  ensureLoggedIn
})

export default controller
export {
  getAdminLoginPage,
  getAdminDashboardPage,
  registerAuth,
  postLogin,
  ensureLoggedIn
}
