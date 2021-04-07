import { logger } from '../../core/utils'
import { credentialsRepo, projectAdmissionKeyRepo } from '../../dataAccess'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { SignupPage } from '../../views/pages'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.SIGNUP,
  asyncHandler(async (request, response) => {
    const projectAdmissionKeyId = (request.query as any).projectAdmissionKey
    if (!projectAdmissionKeyId) {
      return response.redirect(routes.HOME)
    }

    const projectAdmissionKeyResult = await projectAdmissionKeyRepo.findById(projectAdmissionKeyId)

    if (projectAdmissionKeyResult.is_none()) {
      // Key doesnt exist
      logger.warning(
        `getSignupPage called with a projectAdmissionKey that could not be found : ${projectAdmissionKeyId}`
      )
      return response.redirect(routes.HOME)
    }

    const projectAdmissionKey = projectAdmissionKeyResult.unwrap()

    if (request.user) {
      // User is already logged in

      if (projectAdmissionKey.email === request.user.email) {
        // User is already logged in with the same email
        // Redirect to project list
        return response.redirect(routes.USER_LIST_PROJECTS)
      }
      // User is already logged in with a different email
      // Log him out
      request.logout()
    }

    if (projectAdmissionKey.lastUsedAt || projectAdmissionKey.cancelled) {
      return response.redirect(
        addQueryParams(routes.LOGIN, { error: 'Cette invitation n‘est plus valide.' })
      )
    }

    // Display the signup page
    return response.send(
      SignupPage({
        request,
        projectAdmissionKey,
      })
    )
  })
)
