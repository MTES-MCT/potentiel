import fs from 'fs'
import { ensureRole, signalerDemandeDelai } from '@config'
import { logger } from '@core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import { upload } from '../upload'
import moment from 'moment'

const FORMAT_DATE = 'DD/MM/YYYY'

v1Router.post(
  routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST,
  upload.single('file'),
  ensureRole(['admin', 'dgec', 'dreal']),
  asyncHandler(async (request, response) => {
    const {
      body: { projectId, decidedOn, isAccepted, newCompletionDueOn, notes },
      user: signaledBy,
    } = request

    if (!validateUniqueId(projectId)) {
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      })
    }

    const file = request.file && {
      contents: fs.createReadStream(request.file.path),
      filename: `${Date.now()}-${request.file.originalname}`,
    }

    const result = signalerDemandeDelai({
      projectId,
      decidedOn: moment(decidedOn, FORMAT_DATE).toDate().getTime(),
      isAccepted: isAccepted === 'status-accepted',
      newCompletionDueOn: moment(newCompletionDueOn, FORMAT_DATE).toDate().getTime(),
      notes,
      file,
      signaledBy,
    })

    await result.match(
      () => {
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Votre signalement de demande de délai a bien été enregistré.',
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
        return errorResponse({ request, response })
      }
    )
  })
)
