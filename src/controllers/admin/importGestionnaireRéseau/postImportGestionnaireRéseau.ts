import asyncHandler from '../../helpers/asyncHandler'
import routes from '@routes'
import { ensureRole } from '@config'
import { v1Router } from '../../v1Router'
import { upload } from '../../upload'
import { parseCsv } from '../../../helpers/parseCsv'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { logger } from '@core/utils'

if (!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU) {
  v1Router.post(
    routes.IMPORT_GESTIONNAIRE_RESEAU,
    ensureRole(['admin', 'dgec-validateur']),
    upload.single('fichier-import-gestionnaire-réseau'),
    asyncHandler(async (request, response) => {
      if (!request.file || !request.file.path) {
        return response.redirect(
          addQueryParams(routes.IMPORT_GESTIONNAIRE_RESEAU, {
            error: 'Le fichier du gestionnaire de réseau est manquant',
          })
        )
      }

      await parseCsv(request.file.path, {
        delimiter: ';',
        encoding: 'utf8',
      }).match(
        (data) => {
          if (data.length === 0) {
            return response.redirect(
              addQueryParams(routes.IMPORT_GESTIONNAIRE_RESEAU, {
                error: `L'import a échoué car le fichier est vide.`,
              })
            )
          }

          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Le fichier du gestionnaire de réseau a bien été importé.\nVous pouvez suivre l'avancement du traitement dans le suivi de vos tâches de fond.`,
              //@TODO : mettre le lien vers la nouvelle page "tâches"
              redirectUrl: routes.ADMIN_DASHBOARD,
              redirectTitle: 'Retour',
            })
          )
        },
        (error) => {
          logger.error(error)
          return response.redirect(
            addQueryParams(routes.IMPORT_GESTIONNAIRE_RESEAU, {
              error: `Le fichier n'est pas valide.`,
            })
          )
        }
      )
    })
  )
}
