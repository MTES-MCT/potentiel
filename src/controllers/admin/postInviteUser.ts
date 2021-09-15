import { REGIONS } from '../../entities'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { inviteUser } from '../../config'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.post(
  routes.ADMIN_INVITE_USER_ACTION,
  ensureLoggedIn(),
  ensureRole('admin'),
  asyncHandler(async (request, response) => {
    const { email, role } = request.body
    const { user } = request

    if (!['acheteur-obligé', 'ademe'].includes(role)) {
      return response.redirect(
        addQueryParams(routes.ADMIN_USERS, {
          error: 'Le role attendu n‘est pas reconnu.',
        })
      )
    }

    ;(
      await inviteUser({
        email: email.toLowerCase(),
        forRole: role,
        invitedBy: user,
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(routes.ADMIN_USERS, {
            success: `Une invitation a bien été envoyée à ${email}`,
          })
        ),
      (error: Error) =>
        response.redirect(
          addQueryParams(routes.ADMIN_USERS, {
            error: error.message,
          })
        )
    )
  })
)
