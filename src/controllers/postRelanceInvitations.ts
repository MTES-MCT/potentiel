import { Redirect } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { relanceInvitations } from '../useCases'
import { logger } from '../core/utils'

const postRelanceInvitations = async (request: HttpRequest) => {
  if (!request.user || request.user.role !== 'admin') {
    return Redirect(ROUTES.LOGIN)
  }

  const { appelOffreId, periodeId, keys } = request.body

  try {
    let props: any

    if (keys) {
      props = { keys: Array.isArray(keys) ? keys : [keys] }
    } else if (appelOffreId) {
      props = { appelOffreId, periodeId }
    }

    const result = await relanceInvitations(props)
    return result.match({
      ok: (sentRelances: number) =>
        Redirect(ROUTES.ADMIN_INVITATION_LIST, {
          appelOffreId,
          periodeId,
          keys,
          success: sentRelances
            ? `${sentRelances} relances ont été envoyées`
            : `Aucun relance n'a été envoyée. Merci de vérifier qu'il y a bien des invitations à relancer.`,
        }),
      err: (e: Error) => {
        logger.error(e)
        return Redirect(ROUTES.ADMIN_INVITATION_LIST, {
          appelOffreId,
          periodeId,
          keys,
          error: `Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`,
        })
      },
    })
  } catch (error) {
    return Redirect(ROUTES.ADMIN_INVITATION_LIST, {
      appelOffreId,
      periodeId,
      keys,
      error: `Les relances n'ont pas pu être envoyées. (Erreur: La date seuil n'a pas pu être intégrée.)`,
    })
  }
}
export { postRelanceInvitations }
