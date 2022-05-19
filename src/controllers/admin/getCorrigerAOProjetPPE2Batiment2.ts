import asyncHandler from '../helpers/asyncHandler'
import { ensureRole, getProjectIdsForPeriode, projectRepo } from '@config'
import { v1Router } from '../v1Router'
import { combine, logger } from '@core/utils'
import routes from '../../routes'
import { addQueryParams } from '../../helpers/addQueryParams'
import { UniqueEntityID } from '@core/domain'
import { getAppelOffre } from '@dataAccess/inMemory'

v1Router.get(
  '/admin/corriger-ao-projet-ppe2-batiment2',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    getAppelOffre('PPE2 - Bâtiment')
      .andThen((appelOffre) =>
        getProjectIdsForPeriode({ appelOffreId: 'PPE2 - Bâtiment 2', periodeId: '2' }).andThen(
          (projectIds) =>
            combine(
              projectIds.map((projectId) =>
                projectRepo.transaction(new UniqueEntityID(projectId), (project) =>
                  project.modifierAppelOffre(appelOffre)
                )
              )
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
