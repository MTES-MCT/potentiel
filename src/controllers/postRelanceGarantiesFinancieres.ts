import { Redirect, SystemError, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { relanceGarantiesFinancieres } from '../useCases'
import moment from 'moment'

const postRelanceGarantiesFinancieres = async (request: HttpRequest) => {
  // console.log('Call to sendCandidateNotifications received', request.body)

  try {
    const result = await relanceGarantiesFinancieres()
    return result.match({
      ok: () => Success('Relance envoyées avec succès'),
      err: (e: Error) => {
        console.log('postRelanceGarantiesFinancieres failed', e)
        return SystemError(
          `Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`
        )
      },
    })
  } catch (error) {
    return SystemError(
      `Les relances n'ont pas pu être envoyées. (Erreur: ${error.message})`
    )
  }
}
export { postRelanceGarantiesFinancieres }
