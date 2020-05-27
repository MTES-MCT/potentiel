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

  const projects = await listGarantiesFinancieres({ user: request.user })

  return Success(
    GarantiesFinancieresListPage({
      request,
      projects,
    })
  )
}
export { getGarantiesFinancieresPage }
