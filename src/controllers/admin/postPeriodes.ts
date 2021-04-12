import asyncHandler from 'express-async-handler'
import { importPeriodeData } from '../../config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { parseCsv } from '../../helpers/parseCsv'
import { InfraNotAvailableError, UnauthorizedError } from '../../modules/shared'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

v1Router.post(
  routes.IMPORT_PERIODE_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin', 'dgec']),
  upload.single('periodesFile'),
  asyncHandler(async (request, response) => {
    if (!request.file?.path) {
      return response.redirect(
        addQueryParams(routes.ADMIN_AO_PERIODE, {
          error: 'Le fichier des périodes est manquant.',
        })
      )
    }

    // Parse the csv file
    const dataLines = await parseCsv(request.file.path)

    ;(
      await importPeriodeData({
        dataLines,
        importedBy: request.user,
      })
    ).match(
      () => {
        return response.redirect(
          addQueryParams(routes.ADMIN_AO_PERIODE, {
            success: "L'import des données de périodes est un succès.",
          })
        )
      },
      (errors) => {
        if (!errors.length) {
          logger.error(new Error('importPeriodeData a échoué mais sans contenir d‘erreur.'))
          return response.redirect(
            addQueryParams(routes.ADMIN_AO_PERIODE, {
              error:
                "L'import a échoué pour des raisons techniques. Merci de prévenir un administrateur.",
            })
          )
        }

        const firstError = errors[0]

        if (firstError instanceof InfraNotAvailableError) {
          logger.error(firstError)
          return response.redirect(
            addQueryParams(routes.ADMIN_AO_PERIODE, {
              error:
                "L'import a échoué pour des raisons techniques. Merci de prévenir un administrateur.",
            })
          )
        }

        if (firstError instanceof UnauthorizedError) {
          logger.error(firstError)
          return response.redirect(
            addQueryParams(routes.ADMIN_AO_PERIODE, {
              error: "Vous n'avez pas les droits suffisants pour effectuer cette action.",
            })
          )
        }

        const globalMessage = errors.map((error) => error.message).join('\n')

        return response.redirect(
          addQueryParams(routes.ADMIN_AO_PERIODE, {
            error:
              globalMessage.length > 1000
                ? globalMessage.substring(0, 1000) + '...'
                : globalMessage,
          })
        )
      }
    )
  })
)
