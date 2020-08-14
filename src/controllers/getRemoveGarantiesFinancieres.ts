import {
  Redirect,
  SystemError,
  Success,
  NotFoundError,
} from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { removeGarantiesFinancieres } from '../useCases'
import moment from 'moment'

const getRemoveGarantiesFinancieres = async (request: HttpRequest) => {
  const { user } = request

  if (!user) {
    return Redirect(ROUTES.LOGIN)
  }

  const { projectId } = request.params

  if (!projectId) return NotFoundError('')

  try {
    const result = await removeGarantiesFinancieres({
      user,
      projectId,
    })
    return result.match({
      ok: () =>
        Redirect(ROUTES.PROJECT_DETAILS(projectId), {
          success: 'Les garanties financières ont été retirées avec succès',
        }),
      err: (error: Error) => {
        console.log('getRemoveGarantiesFinancieres failed', error)
        return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
          error: `Les garanties financières n'ont pas pu être retirées. (Erreur: ${error.message})`,
        })
      },
    })
  } catch (error) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error: `Les garanties financières n'ont pas pu être retirées. (Erreur: ${error.message})`,
    })
  }
}
export { getRemoveGarantiesFinancieres }
