import { REGIONS } from '../../entities'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { inviteDreal } from '../../useCases'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.ADMIN_INVITE_DREAL_ACTION,
  ensureLoggedIn(),
  ensureRole('admin'),
  async (request, response) => {
    const { email, region } = request.body
    const { user } = request

    if (!region || !REGIONS.includes(region)) {
      return response.redirect(
        addQueryParams(routes.ADMIN_DREAL_LIST, {
          error: 'La région saisie ne correspond à aucune DREAL.',
        })
      )
    }

    ;(
      await inviteDreal({
        email: email.toLowerCase(),
        region,
        user,
      })
    ).match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.ADMIN_DREAL_LIST, {
            success: 'Une invitation a bien été envoyée à ' + email,
          })
        ),
      err: (error: Error) =>
        response.redirect(
          addQueryParams(routes.ADMIN_DREAL_LIST, {
            error: error.message,
          })
        ),
    })
  }
)
