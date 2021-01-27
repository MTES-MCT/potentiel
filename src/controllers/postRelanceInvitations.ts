import { logger } from '../core/utils'
import { addQueryParams } from '../helpers/addQueryParams'
import routes from '../routes'
import { relanceInvitations } from '../useCases'
import { ensureLoggedIn, ensureRole } from './authentication'
import { v1Router } from './v1Router'

v1Router.post(
  routes.ADMIN_INVITATION_RELANCE_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin']),
  async (request, response) => {
    const { appelOffreId, periodeId, keys } = request.body

    let props: any

    if (keys) {
      props = { keys: Array.isArray(keys) ? keys : [keys] }
    } else if (appelOffreId) {
      props = { appelOffreId, periodeId }
    }

    const result = await relanceInvitations(props)
    return result.match({
      ok: (sentRelances: number) =>
        response.redirect(
          addQueryParams(routes.ADMIN_INVITATION_LIST, {
            appelOffreId,
            periodeId,
            keys,
            success: sentRelances
              ? `${sentRelances} relances ont été envoyées`
              : `Aucun relance n'a été envoyée. Merci de vérifier qu'il y a bien des invitations à relancer.`,
          })
        ),
      err: (e: Error) => {
        logger.error(e)
        return response.redirect(
          addQueryParams(routes.ADMIN_INVITATION_LIST, {
            appelOffreId,
            periodeId,
            keys,
            error: `Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`,
          })
        )
      },
    })
  }
)
