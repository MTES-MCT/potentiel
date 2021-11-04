import { logger } from '../../core/utils'
import { USER_ROLES } from '../../entities'
import { GetUserByEmail, makeRegisterFirstUserLogin } from '../../modules/users'

type AttachUserToRequestMiddlewareDependencies = {
  getUserByEmail: GetUserByEmail
  registerFirstUserLogin: ReturnType<typeof makeRegisterFirstUserLogin>
}

const makeAttachUserToRequestMiddleware = ({
  getUserByEmail,
  registerFirstUserLogin,
}: AttachUserToRequestMiddlewareDependencies) => (request, response, next) => {
  if (
    // Theses paths should be prefixed with /static in the future
    request.path.startsWith('/fonts') ||
    request.path.startsWith('/css') ||
    request.path.startsWith('/images') ||
    request.path.startsWith('/scripts') ||
    request.path.startsWith('/main') ||
    request.path === '/'
  ) {
    next()
    return
  }

  // @ts-ignore
  const token = request.kauth?.grant?.access_token
  const userEmail = token?.content?.email
  const kRole = token && USER_ROLES.find((role) => token.hasRealmRole(role))

  if (userEmail && kRole) {
    return getUserByEmail(userEmail).then((userResult) => {
      if (userResult.isOk() && userResult.value !== null) {
        request.user = userResult.value
        request.user.role = kRole

        if (!request.user.isRegistered) {
          registerFirstUserLogin({
            userId: userResult.value.id,
            keycloakId: token?.content?.sub,
          })
        }
      } else {
        logger.error(
          new Error(`Keycloak session open but could not find user in db with email ${userEmail}`)
        )
      }
      next()
    })
  }

  next()
}

export { makeAttachUserToRequestMiddleware }
