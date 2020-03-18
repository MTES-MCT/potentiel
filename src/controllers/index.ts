import makeGetLoginPage from './getLoginPage'
import makeGetAdminDashboardPage from './getAdminDashboardPage'
import makeGetUserDashboardPage from './getUserDashboardPage'
import makeAuthentication from './authentication'
import makePostProjects from './postProjects'
import makeGetSendCandidateNotifications from './getSendCandidateNotifications'
import makeGetCandidateNotification from './getCandidateNotification'
import makeGetSignupPage from './getSignupPage'
import makePostSignup from './postSignup'
import makeGetDemandePage from './getDemandePage'

import { userRepo } from '../dataAccess'

const getLoginPage = makeGetLoginPage()
const getAdminDashboardPage = makeGetAdminDashboardPage()
const getUserDashboardPage = makeGetUserDashboardPage()
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
const getDemandePage = makeGetDemandePage()

const controller = Object.freeze({
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
  postSignup,
  getDemandePage
})

export default controller
export {
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
  postSignup,
  getDemandePage
}
