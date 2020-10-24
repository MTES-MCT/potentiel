import { Redirect, NotFoundError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { removeDCR } from '../useCases'

const getRemoveDCR = async (request: HttpRequest) => {
  const { user } = request

  if (!user) {
    return Redirect(ROUTES.LOGIN)
  }

  const { projectId } = request.params

  if (!projectId) return NotFoundError('')

  try {
    const result = await removeDCR({
      user,
      projectId,
    })
    return result.match({
      ok: () =>
        Redirect(ROUTES.PROJECT_DETAILS(projectId), {
          success: 'La demande complète de raccordement a été retirée avec succès',
        }),
      err: (e: Error) => {
        console.log('getRemoveDCR failed', e)
        return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
          error: `La demande complète de raccordement n'a pas pu être retirée. (Erreur: ${e.message})`,
        })
      },
    })
  } catch (error) {
    return Redirect(ROUTES.PROJECT_DETAILS(projectId), {
      error: `La demande complète de raccordement n'a pas pu être retirée. (Erreur: ${error.message})`,
    })
  }
}
export { getRemoveDCR }
