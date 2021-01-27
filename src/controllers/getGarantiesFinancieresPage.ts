import routes from '../routes'
import { listGarantiesFinancieres } from '../useCases'
import { GarantiesFinancieresListPage } from '../views/pages'
import { ensureLoggedIn, ensureRole } from './authentication'
import { v1Router } from './v1Router'

v1Router.get(
  routes.GARANTIES_FINANCIERES_LIST,
  ensureLoggedIn(),
  ensureRole(['admin', 'dreal']),
  async (request, response) => {
    const { user } = request
    const garantiesFinancieres = await listGarantiesFinancieres({
      user,
    })

    return response.send(
      GarantiesFinancieresListPage({
        request,
        garantiesFinancieres,
      })
    )
  }
)
