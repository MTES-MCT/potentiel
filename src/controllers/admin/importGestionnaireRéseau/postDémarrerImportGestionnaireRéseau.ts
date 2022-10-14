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
  isCsvValidationErrorFeedback,
  isErrorFeedback,
  isSuccessFeedback,
  mapYupValidationErrorToCsvValidationError,
  stringToDateYupTransformation,
} from '../../helpers'
import { ValidationError } from 'yup'
import { Response } from 'express'

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

const ajouterCookie = (response: Response, message) => {
  if (
    !isErrorFeedback(message) &&
    !isSuccessFeedback(message) &&
    !isCsvValidationErrorFeedback(message)
  ) {
    return
  }
  console.log('im here')
  response.clearCookie('postDemarrerImportGestionnaireReseau')
  response.cookie('postDemarrerImportGestionnaireReseau', message)
}

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
    routes.IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-import-gestionnaire-réseau'),
    asyncHandler(async (request, response) => {
      if (!request.file || !request.file.path) {
        ajouterCookie(response, {
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
            ajouterCookie(response, { success: "L'import du fichier a démarré." })
            return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
          },
          (e) => {
            const validationErreurs = e instanceof CsvValidationError ? e.détails : undefined
            ajouterCookie(response, validationErreurs)
            return response.redirect(routes.IMPORT_GESTIONNAIRE_RESEAU)
          }
        )
    })
  )
}
