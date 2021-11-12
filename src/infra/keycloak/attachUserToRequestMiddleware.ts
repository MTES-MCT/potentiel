import { NextFunction, Request, Response } from 'express'
import { GetUserByEmail, makeCreateUser, USER_ROLES } from '../../modules/users'

type AttachUserToRequestMiddlewareDependencies = {
  getUserByEmail: GetUserByEmail
  createUser: ReturnType<typeof makeCreateUser>
}

const makeAttachUserToRequestMiddleware = ({
  getUserByEmail,
  createUser,
}: AttachUserToRequestMiddlewareDependencies) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
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

  const token = request.kauth?.grant?.access_token
  const userEmail = token?.content?.email
  const kRole = token && USER_ROLES.find((role) => token.hasRealmRole(role))

  if (userEmail && kRole) {
    return getUserByEmail(userEmail).then((userResult) => {
      if (userResult.isOk() && userResult.value !== null) {
        request.user = userResult.value
        request.user.role = kRole
      } else {
        const fullName = token?.content?.name
        const createUserArgs = { email: userEmail, role: kRole, fullName }

        createUser(createUserArgs).then((userIdResult) => {
          const userId = userIdResult.isOk() ? userIdResult.value : null

          if (userId) {
            request.user = {
              ...createUserArgs,
              id: userId,
              isRegistered: true,
            }
          }
        })
      }
      next()
    })
  }

  next()
}

export { makeAttachUserToRequestMiddleware }
