import { annulerRéponseDemandeDélai, ensureRole, passerDemandeDélaiEnInstruction } from '@config'
import { logger } from '@core/utils'
import { getModificationRequestAuthority } from '@infra/sequelize/queries'
import { EntityNotFoundError, UnauthorizedError } from '@modules/shared'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.ADMIN_PASSER_DEMANDE_DELAI_EN_INSTRUCTION(),
  ensureRole(['admin', 'dgec', 'dreal']),

  asyncHandler(async (request, response) => {
    const { modificationRequestId } = request.body as any
    const { user } = request

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    if (user.role === 'dreal') {
      const authority = await getModificationRequestAuthority(modificationRequestId)

      if (authority && authority !== user.role) {
        return unauthorizedResponse({ request, response })
      }
    }

    return await passerDemandeDélaiEnInstruction()

    response.redirect(
      routes.SUCCESS_OR_ERROR_PAGE({
        success: 'Votre réponse a bien été enregistrée.',
        redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
        redirectTitle: 'Retourner à la demande',
      })
    )

    console.log('HERE')
  })
)
