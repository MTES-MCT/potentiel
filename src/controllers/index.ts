// import {
//   removeComment
// } from '../use-cases'
import makeGetAdminLoginPage from './getAdminLoginPage'

const getAdminLoginPage = makeGetAdminLoginPage()

const controller = Object.freeze({
  getAdminLoginPage
})

export default controller
export { getAdminLoginPage }
