import fs from 'fs'
import moment from 'moment-timezone'
import { acceptModificationRequest, rejectModificationRequest } from '../../config'
import { logger } from '../../core/utils'
import { pathExists } from '../../helpers/pathExists'
import { addQueryParams } from '../../helpers/addQueryParams'
import { AggregateHasBeenUpdatedSinceError } from '../../modules/shared'
import routes from '../../routes'
import { ensureLoggedIn, ensureRole } from '../auth'
import { upload } from '../upload'
import { v1Router } from '../v1Router'
import asyncHandler from 'express-async-handler'
import { ModificationRequestAcceptanceParams } from '../../modules/modificationRequest'

const FORMAT_DATE = 'DD/MM/YYYY'

v1Router.post(
  routes.ADMIN_REPLY_TO_MODIFICATION_REQUEST,
  ensureLoggedIn(),
  upload.single('file'),
  ensureRole(['admin', 'dgec']),
  asyncHandler(async (request, response) => {
    const {
      modificationRequestId,
      type,
      versionDate,
      submitAccept,
      newNotificationDate,
      delayInMonths,
    } = request.body

    // There are two submit buttons on the form, named submitAccept and submitReject
    // We know which one has been clicked when it has a string value
    const acceptedReply = typeof submitAccept === 'string'

    const courrierReponseExists: boolean = !!request.file && (await pathExists(request.file.path))

    if (!courrierReponseExists) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: "La réponse n'a pas pu être envoyée car il manque le courrier de réponse.",
        })
      )
    }

    if (
      type === 'recours' &&
      (!newNotificationDate ||
        moment(newNotificationDate, FORMAT_DATE).format(FORMAT_DATE) !== newNotificationDate)
    ) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: "La réponse n'a pas pu être envoyée: la date de notification est erronnée.",
        })
      )
    }

    if (
      type === 'delai' &&
      (!delayInMonths || isNaN(delayInMonths) || Number(delayInMonths) <= 0)
    ) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée: le délai accordé doit être un nombre supérieur à 0.",
        })
      )
    }

    if (['recours', 'delai'].includes(type)) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: 'Impossible de répondre à ce type de demande pour le moment.',
        })
      )
    }

    return await (acceptedReply
      ? acceptModificationRequest({
          modificationRequestId,
          versionDate: new Date(Number(versionDate)),
          responseFile: fs.createReadStream(request.file.path),
          acceptanceParams: makeAcceptanceParams(type, {
            newNotificationDate:
              newNotificationDate &&
              moment(newNotificationDate, FORMAT_DATE).tz('Europe/Paris').toDate(),
            delayInMonths: delayInMonths && Number(delayInMonths),
          })!,
          submittedBy: request.user,
        })
      : rejectModificationRequest({
          modificationRequestId,
          versionDate: new Date(Number(versionDate)),
          responseFile: fs.createReadStream(request.file.path),
          rejectedBy: request.user,
        })
    ).match(
      () =>
        response.redirect(
          addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
            success: 'Votre réponse a bien été enregistrée.',
          })
        ),
      (e) => {
        logger.error(e)

        if (e instanceof AggregateHasBeenUpdatedSinceError) {
          return response.redirect(
            addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
              error: `Votre réponse n'a pas pu être prise en compte parce que la demande a été mise à jour entre temps. Merci de réessayer.`,
            })
          )
        }

        response.redirect(
          addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
            error: `Votre réponse n'a pas pu être prise en compte.`,
          })
        )
      }
    )
  })
)

function makeAcceptanceParams(
  type: string,
  params: any
): ModificationRequestAcceptanceParams | undefined {
  const { newNotificationDate, delayInMonths } = params
  switch (type) {
    case 'recours':
      return {
        type,
        newNotificationDate,
      }
    case 'delai':
      return { type, delayInMonths }
  }
}
