import asyncHandler from '../helpers/asyncHandler'
import { ensureRole, getProjectIdsForPeriode, modifierAppelOffreProjet } from '@config'
import { v1Router } from '../v1Router'
import { combine, logger } from '@core/utils'
import routes from '../../routes'
import { addQueryParams } from '../../helpers/addQueryParams'

v1Router.post(
  'admin/corriger-ao-projet-ppe2-batiment2',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    getProjectIdsForPeriode({ appelOffreId: 'PPE2 - Bâtiment 2', periodeId: '2' })
      .andThen((projectIds) =>
        combine(
          projectIds.map((projectId) =>
            modifierAppelOffreProjet({ projectId, appelOffreId: 'PPE2 - Bâtiment' })
          )
        )
      )
      .match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: ``,
              redirectUrl: addQueryParams(routes.ADMIN_LIST_PROJECTS, {
                appelOffreId: 'PPE2 - Bâtiment',
                periodeId: '2',
              }),
              redirectTitle: `Voir le listing des projets corrigés pour la période 2 de l'AO "PPE2 - Bâtiment"`,
            })
          ),
        (e: Error) => {
          logger.error(e)
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              error: `Une erreur est survenue lors de la correction de l'AO des projets pour "PPE2 - Bâtiment 2"`,
            })
          )
        }
      )
  })
)
