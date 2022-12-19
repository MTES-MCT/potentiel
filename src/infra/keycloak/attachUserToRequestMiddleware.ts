import { NextFunction, Request, Response } from 'express'
import { logger, ok } from '@core/utils'
import { GetUserByEmail, USER_ROLES } from '@modules/users'
import { getPermissions } from '@modules/authN'
import { CréerProfilUtilisateur } from '@modules/utilisateur'

type AttachUserToRequestMiddlewareDependencies = {
  getUserByEmail: GetUserByEmail
  créerProfilUtilisateur: CréerProfilUtilisateur
}

const makeAttachUserToRequestMiddleware =
  ({ getUserByEmail, créerProfilUtilisateur }: AttachUserToRequestMiddlewareDependencies) =>
  async (request: Request, response: Response, next: NextFunction) => {
    if (
      // Theses paths should be prefixed with /static in the future
      request.path.startsWith('/fonts') ||
      request.path.startsWith('/css') ||
      request.path.startsWith('/images') ||
      request.path.startsWith('/scripts') ||
      request.path.startsWith('/main')
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

          const [nom, prénom] = token?.content?.name.split(' ')
          const créerProfileUtilisateurArgs = {
            email: userEmail,
            nom,
            prénom,
          }

          return créerProfilUtilisateur(créerProfileUtilisateurArgs).andThen(({ id }) => {
            if (!kRole) {
              request.session.destroy(() => {})
            }

            return ok({ ...créerProfileUtilisateurArgs, id, role: kRole })
          })
        })
        .match(
          (user) => {
            request.user = {
              ...user,
              accountUrl: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}/account`,
              permissions: getPermissions(user),
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
