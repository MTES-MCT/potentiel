import { logger } from '../../core/utils'
import moment from 'moment-timezone'
import { addQueryParams } from '../../helpers/addQueryParams'
import routes from '../../routes'
import { regenerateCertificatesForPeriode } from '../../config/useCases.config'
import { ensureLoggedIn, ensureRole } from '../auth'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'

const FORMAT_DATE = 'DD/MM/YYYY'

v1Router.post(
  routes.ADMIN_REGENERATE_CERTIFICATES_ACTION,
  ensureLoggedIn(),
  ensureRole(['admin']),
  asyncHandler(async (request, response) => {
    const { appelOffreAndPeriode, reason, notificationDate } = request.body
    const { user } = request

    const [appelOffreId, periodeId] = appelOffreAndPeriode?.split('|')

    if (
      notificationDate &&
      moment(notificationDate, FORMAT_DATE).format(FORMAT_DATE) !== notificationDate
    ) {
      return response.redirect(
        addQueryParams(routes.ADMIN_REGENERATE_CERTIFICATES, {
          error: 'La date de notification est au mauvais format.',
          ...request.body,
        })
      )
    }

    ;(
      await regenerateCertificatesForPeriode({
        appelOffreId,
        periodeId,
        user,
        reason,
        newNotifiedOn: moment(notificationDate, FORMAT_DATE).tz('Europe/London').toDate().getTime(),
      })
    ).match(
      () =>
        response.redirect(
          addQueryParams(routes.ADMIN_REGENERATE_CERTIFICATES, {
            success: `Les attestations de la période ${appelOffreId} - ${periodeId} sont en cours de regénération. Les porteurs de projets seront prévenus par email dès que leur nouvelle attestation sera prête.`,
          })
        ),
      (e: Error) => {
        logger.error(e)
        response.redirect(
          addQueryParams(routes.ADMIN_REGENERATE_CERTIFICATES, {
            ...request.body,
            error: `Les relances n'ont pas pu être envoyées. (Erreur: ${e.message})`,
          })
        )
      }
    )
  })
)
