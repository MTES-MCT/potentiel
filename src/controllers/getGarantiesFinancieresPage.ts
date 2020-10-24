import { Redirect, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { listGarantiesFinancieres } from '../useCases'
import { GarantiesFinancieresListPage } from '../views/pages'

const getGarantiesFinancieresPage = async (request: HttpRequest) => {
  if (!request.user) {
    return Redirect(ROUTES.LOGIN)
  }

  const garantiesFinancieres = await listGarantiesFinancieres({
    user: request.user,
  })

  return Success(
    GarantiesFinancieresListPage({
      request,
      garantiesFinancieres,
    })
  )
}
export { getGarantiesFinancieresPage }
