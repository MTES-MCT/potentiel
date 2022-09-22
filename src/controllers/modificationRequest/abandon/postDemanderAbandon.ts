import fs from 'fs'
import * as yup from 'yup'

import { demanderAbandon, ensureRole } from '@config'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'

import { addQueryParams } from '../../../helpers/addQueryParams'
import { errorResponse, unauthorizedResponse } from '../../helpers'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import safeAsyncHandler from '../../helpers/safeAsyncHandler'

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    justification: yup.string().optional(),
    numeroGestionnaire: yup.string().optional(),
  }),
})

v1Router.post(
  routes.DEMANDE_ABANDON_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.DEMANDER_DELAI(request.body.projectId), {
            ...error.errors,
          })
        ),
    },
    async (request, response) => {
      const { user } = request
      const { projectId, justification } = request.body

      const file = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      }

      return demanderAbandon({
        user,
        projectId,
        file,
        justification,
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Votre demande d'abandon a bien été envoyée.`,
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          logger.error(error)
          return errorResponse({
            request,
            response,
            customMessage:
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          })
        }
      )
    }
  )
)
