import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { upload } from '../../upload'
import { parseCsv } from '../../../helpers/parseCsv'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { errAsync, logger, okAsync } from '@core/utils'
import * as yup from 'yup'
import { stringToDateYupTransformation } from '../../helpers'

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
        .typeError(`Une date de mise en service n'est pas valide`),
    })
  )

if (!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU) {
  v1Router.post(
    routes.POST_DEMARRER_IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-import-gestionnaire-réseau'),
    asyncHandler(async (request, response) => {
      if (!request.file?.path) {
        return response.redirect(
          addQueryParams(routes.IMPORT_GESTIONNAIRE_RESEAU, {
            error: 'Le fichier est obligatoire',
          })
        )
      }

      await parseCsv(request.file.path, {
        delimiter: ';',
        encoding: 'utf8',
      })
        .andThen(validerLesDonnéesDuFichierCsv)
        .match(
          () => {
            return response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: `L'import du fichier a démarré.`,
                redirectUrl: routes.ADMIN_DASHBOARD,
                redirectTitle: 'Retour aux projets',
              })
            )
          },
          (error) => {
            logger.error(error)
            return response.redirect(
              addQueryParams(routes.IMPORT_GESTIONNAIRE_RESEAU, {
                error: error.message,
              })
            )
          }
        )
    })
  )
}

const validerLesDonnéesDuFichierCsv = (données: Record<string, string>[]) => {
  try {
    const donnéesValidées = csvDataSchema.validateSync(données)
    return okAsync(donnéesValidées)
  } catch (error) {
    return errAsync(new Error('Le fichier csv contient des valeurs incorrectes'))
  }
}
