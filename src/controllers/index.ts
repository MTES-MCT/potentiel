import makeGetLoginPage from './getLoginPage'
import makeGetAdminDashboardPage from './getAdminDashboardPage'
import makeAuthentication from './authentication'
import makePostProjects from './postProjects'
import makeGetSendCandidateNotifications from './getSendCandidateNotifications'
import makeGetCandidateNotification from './getCandidateNotification'
import makeGetSignupPage from './getSignupPage'
import makePostSignup from './postSignup'

import { userRepo } from '../dataAccess'

const getLoginPage = makeGetLoginPage()
const getAdminDashboardPage = makeGetAdminDashboardPage()
const {
  registerAuth,
  postLogin,
  ensureLoggedIn,
  logoutMiddleware
} = makeAuthentication({
  userRepo
})
const postProjects = makePostProjects()
const getSendCandidateNotifications = makeGetSendCandidateNotifications()
const getCandidateNotification = makeGetCandidateNotification()
const getSignupPage = makeGetSignupPage()
const postSignup = makePostSignup()

const controller = Object.freeze({
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
})

export default controller
export {
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
}
