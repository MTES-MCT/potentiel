import { Redirect, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { inviteDreal } from '../useCases'
import moment from 'moment'
import { REGIONS } from '../entities'

const postInviteDreal = async (request: HttpRequest) => {
  // console.log('Call to postInviteDreal received', request.body)

  const { email, region } = request.body
  const { user } = request

  if (!user) {
    return SystemError('User must be logged in')
  }

  if (!region || !REGIONS.includes(region)) {
    return Redirect(ROUTES.ADMIN_DREAL_LIST, {
      error: 'La région saisie ne correspond à aucune DREAL.',
    })
  }

  const result = await inviteDreal({
    email,
    region,
    user,
  })

  return result.match({
    ok: () =>
      Redirect(ROUTES.ADMIN_DREAL_LIST, {
        success: 'Une invitation a bien été envoyée à ' + email,
      }),
    err: (error: Error) =>
      Redirect(ROUTES.ADMIN_DREAL_LIST, {
        error: error.message,
      }),
  })
}
export { postInviteDreal }
