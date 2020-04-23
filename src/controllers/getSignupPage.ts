import { Success, Redirect } from '../helpers/responses'
import { HttpRequest } from '../types'
import { SignupPage } from '../views/pages'
import { projectAdmissionKeyRepo, credentialsRepo } from '../dataAccess'
import routes from '../routes'

const getSignupPage = async (request: HttpRequest) => {
  // console.log('Call to getSignupPage received', request.query)

  const projectAdmissionKeyId = request.query.projectAdmissionKey
  if (!projectAdmissionKeyId) {
    return Redirect(routes.HOME)
  }

  const projectAdmissionKeyResult = await projectAdmissionKeyRepo.findById(
    projectAdmissionKeyId
  )

  if (projectAdmissionKeyResult.is_none()) {
    // Key doesnt exist
    console.log(
      'getSignupPage called with a projectAdmissionKey that could not be found',
      projectAdmissionKeyId
    )
    return Redirect(routes.HOME)
  }

  const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

  let logoutUser = false
  if (request.user) {
    // User is already logged in

    if (projectAdmissionKey.email === request.user.email) {
      // User is already logged in with the same email
      // Redirect to project list
      return Redirect(routes.USER_LIST_PROJECTS)
    }
    // User is already logged in with a different email
    // Log him out
    logoutUser = true
  } else {
    // User is not logged in but account exists with this email, log him ins
    const existingCredentialsForEmail = await credentialsRepo.findByEmail(
      projectAdmissionKey.email
    )

    if (existingCredentialsForEmail.is_some()) {
      return Redirect(
        routes.USER_LIST_PROJECTS,
        {},
        existingCredentialsForEmail.unwrap().userId
      )
    }
  }

  // Display the signup page
  return Success(
    SignupPage({
      request,
      projectAdmissionKey,
    }),
    logoutUser
  )
}
export { getSignupPage }
