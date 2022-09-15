import { ensureRole, requestActionnaireModification, requestPuissanceModification } from '@config'
import { logger } from '@core/utils'
import { PuissanceJustificationOrCourrierMissingError } from '@modules/modificationRequest'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '@modules/shared'
import routes from '@routes'
import { requestModification, shouldUserAccessProject } from '@useCases'
import fs from 'fs'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { addQueryParams } from '../../helpers/addQueryParams'
import { isStrictlyPositiveNumber } from '../../helpers/formValidators'
import { pathExists } from '../../helpers/pathExists'
import toNumber from '../../helpers/toNumber'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

const routeRedirection = (type, projectId) => {
  let returnRoute: string
  switch (type) {
    case 'actionnaire':
      returnRoute = routes.CHANGER_ACTIONNAIRE(projectId)
      break
    case 'puissance':
      returnRoute = routes.CHANGER_PUISSANCE(projectId)
      break
    case 'recours':
      returnRoute = routes.DEPOSER_RECOURS(projectId)
      break
    default:
      returnRoute = routes.USER_LIST_PROJECTS
      break
  }
  return returnRoute
}

v1Router.post(
  routes.DEMANDE_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    const { projectId } = request.body

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const userAccess = await shouldUserAccessProject({
      projectId,
      user: request.user,
    })

    if (!userAccess) {
      return unauthorizedResponse({ request, response })
    }

    const data = pick(request.body, [
      'type',
      'actionnaire',
      'puissance',
      'justification',
      'projectId',
      'numeroGestionnaire',
      'evaluationCarbone',
      'nouvellesRèglesDInstructionChoisies',
    ])

    if (data.type === 'puissance' && !isStrictlyPositiveNumber(data.puissance)) {
      const { projectId, type } = data
      return response.redirect(
        addQueryParams(routeRedirection(type, projectId), {
          error: 'Erreur: la puissance n‘est pas valide.',
        })
      )
    }

    data.evaluationCarbone = data.evaluationCarbone ? Number(data.evaluationCarbone) : undefined

    let file

    if (request.file) {
      const dirExists: boolean = await pathExists(request.file.path)

      if (!dirExists) {
        const { projectId, type } = data
        return response.redirect(
          addQueryParams(routeRedirection(type, projectId), {
            error: "Erreur: la pièce-jointe n'a pas pu être intégrée. Merci de réessayer.",
          })
        )
      }

      file = {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      }
    }

    const handleSuccess = () =>
      response.redirect(
        routes.SUCCESS_OR_ERROR_PAGE({
          success: 'Votre demande a bien été prise en compte.',
          redirectUrl: routes.PROJECT_DETAILS(projectId),
          redirectTitle: 'Retourner à la page projet',
        })
      )

    const handleError = (error) => {
      const { projectId, type } = data
      const redirectRoute = routeRedirection(type, projectId)

      if (error instanceof PuissanceJustificationOrCourrierMissingError) {
        return response.redirect(
          addQueryParams(redirectRoute, {
            ...omit(data, 'projectId'),
            error: error.message,
          })
        )
      }

      if (error instanceof AggregateHasBeenUpdatedSinceError) {
        return response.redirect(
          addQueryParams(redirectRoute, {
            ...omit(data, 'projectId'),
            error:
              'Le projet a été modifié entre le moment où vous avez ouvert cette page et le moment où vous avez validé la demande. Merci de prendre en compte le changement et refaire votre demande si nécessaire.',
          })
        )
      }

      if (error instanceof EntityNotFoundError) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
      } else if (error instanceof UnauthorizedError) {
        return unauthorizedResponse({ request, response })
      }

      logger.error(error)

      return errorResponse({ request, response })
    }

    switch (data.type) {
      case 'puissance':
        await requestPuissanceModification({
          projectId: data.projectId,
          requestedBy: request.user,
          newPuissance: data.puissance && toNumber(data.puissance),
          justification: data.justification,
          file,
        }).match(handleSuccess, handleError)
        break
      case 'actionnaire':
        await requestActionnaireModification({
          projectId: data.projectId,
          requestedBy: request.user,
          newActionnaire: data.actionnaire,
          justification: data.justification,
          file,
        }).match(handleSuccess, handleError)
        break
      default:
        ;(
          await requestModification({
            ...data,
            file,
            user: request.user,
          })
        ).match({
          ok: handleSuccess,
          err: handleError,
        })
        break
    }
  })
)
