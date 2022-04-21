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
import * as yup from 'yup'
import { ValidationError } from 'yup'
import { addQueryParams } from '../../helpers/addQueryParams'
import { parse, isDate } from 'date-fns'

const parseDateString = (value, originalValue) => {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'yyyy-MM-dd', new Date())

  return parsedDate
}
const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  decidedOn: yup
    .date()
    .transform(parseDateString)
    .required('Ce champ est obligatoire')
    .typeError(`La date saisie n'est pas valide`),
  status: yup
    .mixed()
    .oneOf(['acceptée', 'rejetée', 'accord-de-principe'])
    .required('Ce champ est obligatoire'),
  newCompletionDueOn: yup
    .date()
    .transform(parseDateString)
    .optional()
    .typeError(`La date saisie n'est pas valide`),
  notes: yup.string().optional(),
})
const FORMAT_DATE = 'YYYY-MM-DD'

v1Router.post(
  routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST,
  upload.single('file'),
  ensureRole(['admin', 'dgec', 'dreal']),
  asyncHandler(async (request, response) => {
    try {
      requestBodySchema.validateSync(request.body, { abortEarly: false })
    } catch (error) {
      if (error instanceof ValidationError) {
        return response.redirect(
          addQueryParams(routes.ADMIN_SIGNALER_DEMANDE_DELAI_PAGE(request.body.projectId), {
            ...request.body,
            ...error.inner.reduce(
              (errors, { path, message }) => ({ ...errors, [`error-${path}`]: message }),
              {}
            ),
          })
        )
      }
    }

    const {
      body: { projectId, decidedOn, status, newCompletionDueOn, notes },
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
      status,
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
