import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { upload } from '../../upload'
import { parseCsv } from '../../../helpers/parseCsv'
import { errAsync, okAsync } from '@core/utils'
import * as yup from 'yup'
import {
  CsvValidationError,
  Feedback,
  mapYupValidationErrorToCsvValidationError,
  stringToDateYupTransformation,
} from '../../helpers'
import { ValidationError } from 'yup'
import { Request } from 'express'

const csvDataSchema = yup
  .array()
  .ensure()
  .min(1, 'Le fichier ne doit pas être vide')
  .of(
    yup.object({
      numeroGestionnaire: yup.string().required('Le numéro gestionnaire est obligatoire'),
      'date de MES': yup
        .date()
        .nullable()
        .transform((_, originalValue) => stringToDateYupTransformation(originalValue, 'dd/MM/yyyy'))
        .typeError(`La date de mise en service n'est pas valide`),
    })
  )

const validerLesDonnéesDuFichierCsv = (données: Record<string, string>[]) => {
  try {
    const donnéesValidées = csvDataSchema.validateSync(données, { abortEarly: false })
    return okAsync(donnéesValidées)
  } catch (error) {
    if (error instanceof ValidationError) {
      return errAsync(mapYupValidationErrorToCsvValidationError(error))
    }

    return errAsync(new CsvValidationError({ validationErreurs: [] }))
  }
}
if (!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU) {
  v1Router.post(
    routes.POST_DEMARRER_IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-import-gestionnaire-réseau'),
    asyncHandler(async (request, response) => {
      if (!request.file || !request.file.path) {
        setFormFeedback(request, routes.IMPORT_GESTIONNAIRE_RESEAU, {
          error: 'Le fichier est obligatoire',
        })
        return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
      }

      await parseCsv(request.file.path, {
        delimiter: ';',
        encoding: 'utf8',
      })
        .andThen(validerLesDonnéesDuFichierCsv)
        .match(
          () => {
            setFormFeedback(request, routes.IMPORT_GESTIONNAIRE_RESEAU, {
              success: "L'import du fichier a démarré.",
            })
            return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
          },
          (e) => {
            const validationErreurs = e instanceof CsvValidationError ? e.détails : undefined
            setFormFeedback(request, routes.IMPORT_GESTIONNAIRE_RESEAU, validationErreurs)
            return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
          }
        )
    })
  )
}

const setFormFeedback = (request: Request, formId: string, feedback: Feedback | undefined) => {
  const form = request.session.forms && request.session.forms[formId]

  request.session.forms = {
    ...request.session.forms,
    [formId]: {
      ...form,
      feedback,
    },
  }
}
