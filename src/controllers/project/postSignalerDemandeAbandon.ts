import { Request } from 'express'
import fs from 'fs'
import { ensureRole, signalerDemandeAbandon } from '@config'
import { err, logger, ok, Result } from '@core/utils'
import asyncHandler from '../helpers/asyncHandler'
import { UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import { upload } from '../upload'
import * as yup from 'yup'
import { ValidationError } from 'yup'
import { addQueryParams } from '../../helpers/addQueryParams'
import { parse } from 'date-fns'

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  decidedOn: yup
    .date()
    .transform((_, dateString) => parse(dateString, 'yyyy-MM-dd', new Date()))
    .required('Ce champ est obligatoire')
    .typeError(`La date saisie n'est pas valide`),
  status: yup
    .mixed<'acceptée' | 'rejetée'>()
    .oneOf(['acceptée', 'rejetée'])
    .required('Ce champ est obligatoire'),
  notes: yup.string().optional(),
})

type RequestBody = yup.InferType<typeof requestBodySchema>

class RequestValidationError extends Error {
  constructor(public errors: { [fieldName: string]: string }) {
    super("La requête n'est pas valide.")
  }
}

const validateRequestBody = (
  body: Request['body'],
  schema: typeof requestBodySchema
): Result<RequestBody, any> => {
  try {
    return ok(schema.validateSync(body, { abortEarly: false }))
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.inner.reduce(
        (errors, { path, message }) => ({ ...errors, [`error-${path}`]: message }),
        {}
      )
      return err(new RequestValidationError(errors))
    }

    return err(error)
  }
}

v1Router.post(
  routes.ADMIN_SIGNALER_DEMANDE_ABANDON_POST,
  upload.single('file'),
  ensureRole(['admin', 'dgec', 'dreal']),
  asyncHandler(async (request, response) => {
    const validation = validateRequestBody(request.body, requestBodySchema)

    if (validation.isErr()) {
      if (validation.error instanceof RequestValidationError) {
        return response.redirect(
          addQueryParams(routes.ADMIN_SIGNALER_DEMANDE_ABANDON_PAGE(request.body.projectId), {
            ...request.body,
            ...validation.error.errors,
          })
        )
      }

      logger.error(validation.error)
      return errorResponse({
        request,
        response,
        customMessage:
          'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
      })
    }

    const body = validation.value
    const { projectId, decidedOn, status, notes } = body
    const { user: signaledBy } = request

    const file = request.file && {
      contents: fs.createReadStream(request.file.path),
      filename: `${Date.now()}-${request.file.originalname}`,
    }

    const result = signalerDemandeAbandon({
      projectId,
      decidedOn,
      status,
      notes,
      file,
      signaledBy,
    })

    await result.match(
      () => {
        response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: `Votre signalement de demande d'abandon a bien été enregistré.`,
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
