import routes from '../../routes'
import { listGarantiesFinancieres } from '../../useCases'
import { GarantiesFinancieresListPage } from '../../views/pages'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

v1Router.get(
  routes.GARANTIES_FINANCIERES_LIST,
  ensureLoggedIn(),
  ensureRole(['admin', 'dreal']),
  asyncHandler(async (request, response) => {
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
  })
)
