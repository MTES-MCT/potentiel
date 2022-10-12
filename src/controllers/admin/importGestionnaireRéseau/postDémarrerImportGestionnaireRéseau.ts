import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { upload } from '../../upload'
import { parseCsv } from '../../../helpers/parseCsv'
import { errAsync, logger, okAsync } from '@core/utils'
import * as yup from 'yup'
import { stringToDateYupTransformation, yupFormatCsvDataError } from '../../helpers'
import { ImportGestionnaireReseauPage } from '@views'

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

if (!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU) {
  v1Router.post(
    routes.IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-import-gestionnaire-réseau'),
    asyncHandler(async (request, response) => {
      if (!request.file || !request.file.path) {
        return response.send(
          ImportGestionnaireReseauPage({ request, error: 'Le fichier est obligatoire' })
        )
      }

      await parseCsv(request.file.path, {
        delimiter: ';',
        encoding: 'utf8',
      })
        .andThen(validerLesDonnéesDuFichierCsv)
        .match(
          () =>
            response.send(
              ImportGestionnaireReseauPage({ request, success: "L'import du fichier a démarré." })
            ),
          (validationErreurs) => {
            logger.error(validationErreurs)
            return response.send(ImportGestionnaireReseauPage({ request, validationErreurs }))
          }
        )
    })
  )
}

const validerLesDonnéesDuFichierCsv = (données: Record<string, string>[]) => {
  try {
    const donnéesValidées = csvDataSchema.validateSync(données)
    return okAsync(donnéesValidées)
  } catch (errors) {
    const formattedErrors = yupFormatCsvDataError(errors)
    return errAsync(formattedErrors)
  }
}
