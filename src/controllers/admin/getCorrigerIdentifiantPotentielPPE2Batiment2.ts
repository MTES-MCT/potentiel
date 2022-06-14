import { ensureRole, getProjectIdsForPeriode, projectRepo } from '@config'
import { v1Router } from '../v1Router'
import asyncHandler from '../helpers/asyncHandler'
import { combine } from 'neverthrow'
import { UniqueEntityID } from '../../core/domain'
import { Project } from '../../modules/project'
import { logger, Result } from '@core/utils'
import routes from '../../routes'
import { addQueryParams } from '../../helpers/addQueryParams'

v1Router.get(
  '/admin/corriger-identifiant-potentiel-ppe2-batiment-2',
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    getProjectIdsForPeriode({ appelOffreId: 'PPE2 - Bâtiment', periodeId: '2' })
      .andThen((projectIds) =>
        combine(
          projectIds.map((projectId) =>
            projectRepo.transaction(
              new UniqueEntityID(projectId),
              (project: Project): Result<null, null> => {
                return project.corrigerIdentifiantPotentielPPE2Batiment2()
              }
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
              error: `Une erreur est survenue lors de la correction des identifiants Potentiel de "PPE2 - Bâtiment 2"`,
            })
          )
        }
      )
  })
)
