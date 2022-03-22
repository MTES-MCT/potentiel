import { NextFunction, Request, Response } from 'express'
import { logger, ok } from '@core/utils'
import { CreateUser, GetUserByEmail, USER_ROLES } from '@modules/users'

type AttachUserToRequestMiddlewareDependencies = {
  getUserByEmail: GetUserByEmail
  createUser: CreateUser
}

const makeAttachUserToRequestMiddleware =
  ({ getUserByEmail, createUser }: AttachUserToRequestMiddlewareDependencies) =>
  async (request: Request, response: Response, next: NextFunction) => {
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
    const kRole = USER_ROLES.find((role) => token?.hasRealmRole(role))

    if (userEmail) {
      await getUserByEmail(userEmail)
        .andThen((user) => {
          if (user) {
            return ok({
              ...user,
              role: kRole!,
            })
          }

          const fullName = token?.content?.name
          const createUserArgs = { email: userEmail, role: kRole, fullName }

          return createUser(createUserArgs).andThen(({ id, role }) => {
            if (!kRole) {
              request.session.destroy(() => {})
            }

            return ok({ ...createUserArgs, id, role })
          })
        })
        .match(
          (user) => {
            request.user = {
              ...user,
              accountUrl: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account`,
            }
          },
          (e: Error) => {
            logger.error(e)
          }
        )
    }

    next()
  }

export { makeAttachUserToRequestMiddleware }
