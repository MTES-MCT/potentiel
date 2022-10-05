import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { DatesMiseEnServicePage } from '@views'
import { upload } from '../../upload'
import { parseCsv } from 'src/helpers/parseCsv'
import { addQueryParams } from 'src/helpers/addQueryParams'
import { logger } from '@core/utils'

if (!!process.env.ENABLE_IMPORT_DATES_MISE_EN_SERVICE) {
  v1Router.post(
    routes.ADMIN_IMPORT_FICHIER_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-import-date-mise-en-service'),
    asyncHandler(async (request, response) => {
      if (!request.file || !request.file.path) {
        return response.redirect(
          addQueryParams(routes.ADMIN_IMPORT_FICHIER_GESTIONNAIRE_RESEAU, {
            error: 'Le fichier du gestionnaire de réseau est manquant',
          })
        )
      }

      const linesResult = await parseCsv(request.file.path, {
        delimiter: ';',
        encoding: 'utf8',
      })

      if (linesResult.isErr()) {
        logger.error(linesResult.error)
        return response.redirect(
          addQueryParams(routes.ADMIN_IMPORT_FICHIER_GESTIONNAIRE_RESEAU, {
            error: 'Le traitement du fichier a échoué',
          })
        )
      }

      return response.send(DatesMiseEnServicePage({ request }))
    })
  )
}
