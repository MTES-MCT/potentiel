// import {
//   removeComment
// } from '../use-cases'
import makeGetAdminLoginPage from './getAdminLoginPage'
import makeGetAdminDashboardPage from './getAdminDashboardPage'

const getAdminLoginPage = makeGetAdminLoginPage()
const getAdminDashboardPage = makeGetAdminDashboardPage()

const controller = Object.freeze({
  getAdminLoginPage,
  getAdminDashboardPage
})

export default controller
export { getAdminLoginPage, getAdminDashboardPage }
