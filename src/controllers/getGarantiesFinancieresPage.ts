import { Redirect, Success } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'
import { listGarantiesFinancieres } from '../useCases'
import { GarantiesFinancieresListPage } from '../views/pages'

const getGarantiesFinancieresPage = async (request: HttpRequest) => {
  // console.log('Call to getGarantiesFinancieresPage received')

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
