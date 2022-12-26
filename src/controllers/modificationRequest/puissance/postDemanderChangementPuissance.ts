import * as yup from 'yup'

import { ensureRole, requestPuissanceModification } from '@config'
import { logger } from '@core/utils'
import { PuissanceJustificationEtCourrierManquantError } from '@modules/modificationRequest'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '@modules/shared'
import routes from '@routes'
import fs from 'fs'
import omit from 'lodash/omit'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { isStrictlyPositiveNumber } from '../../../helpers/formValidators'
import toNumber from '../../../helpers/toNumber'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import safeAsyncHandler from 'src/controllers/helpers/safeAsyncHandler'

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    puissance: yup.string().required(`Le champ 'Nouvelle puissance" est obligatoire.`),
    justification: yup.string().optional(),
  }),
})

v1Router.post(
  routes.CHANGEMENT_PUISSANCE_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.DEMANDER_CHANGEMENT_PUISSANCE(request.body.projectId), {
            ...omit(request.body, 'projectId'),
            error: `${error.errors.join(' ')}`,
          })
        ),
    },
    async (request, response) => {
      const {
        body: { projectId, puissance, justification },
        user,
        file,
      } = request

      const fichier = file && {
        contents: fs.createReadStream(file.path),
        filename: `${Date.now()}-${file.originalname}`,
      }

      if (!isStrictlyPositiveNumber(puissance)) {
        return response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(projectId), {
            error: 'Erreur: la puissance n‘est pas valide.',
          })
        )
      }

      await requestPuissanceModification({
        projectId,
        requestedBy: user,
        newPuissance: puissance && toNumber(puissance),
        ...(justification && { justification }),
        ...(fichier && { fichier }),
      }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre demande a bien été prise en compte.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          ),
        (error) => {
          if (error instanceof PuissanceJustificationEtCourrierManquantError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(projectId), {
                ...omit(request.body, 'projectId'),
                error: error.message,
              })
            )
          }

          if (error instanceof AggregateHasBeenUpdatedSinceError) {
            return response.redirect(
              addQueryParams(routes.PROJECT_DETAILS(projectId), {
                ...omit(request.body, 'projectId'),
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
      )
    }
  )
)
