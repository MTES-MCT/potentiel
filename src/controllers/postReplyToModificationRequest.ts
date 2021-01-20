import fs from 'fs'
import moment from 'moment-timezone'
import util from 'util'
import { acceptModificationRequest } from '../config'
import { pathExists, logger } from '../core/utils'
import { Redirect, SystemError } from '../helpers/responses'
import ROUTES from '../routes'
import { HttpRequest } from '../types'

const deleteFile = util.promisify(fs.unlink)

const FORMAT_DATE = 'DD/MM/YYYY'

const postReplyToModificationRequest = async (request: HttpRequest) => {
  if (!request.user) {
    return SystemError('User must be logged in')
  }

  const {
    modificationRequestId,
    type,
    versionDate,
    submitAccept,
    newNotificationDate,
  } = request.body

  // There are two submit buttons on the form, named submitAccept and submitReject
  // We know which one has been clicked when it has a string value
  const acceptedReply = typeof submitAccept === 'string'

  const courrierReponseExists: boolean = !!request.file && (await pathExists(request.file.path))

  if (!courrierReponseExists) {
    return Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
      error: "La réponse n'a pas pu être envoyée car il manque le courrier de réponse.",
    })
  }

  if (
    !newNotificationDate ||
    moment(newNotificationDate, FORMAT_DATE).format(FORMAT_DATE) !== newNotificationDate
  ) {
    return Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
      error: "Les notifications n'ont pas pu être envoyées: la date de notification est erronnée.",
    })
  }

  if (type === 'recours' && acceptedReply) {
    const result = await acceptModificationRequest({
      modificationRequestId,
      versionDate: new Date(Number(versionDate)),
      responseFile: fs.createReadStream(request.file.path),
      acceptanceParams: {
        newNotificationDate: moment(newNotificationDate, FORMAT_DATE).tz('Europe/Paris').toDate(),
      },
      submittedBy: request.user,
    })

    try {
      await deleteFile(request.file.path)
    } catch (error) {
      logger.error(error)
    }

    return result.match(
      () =>
        Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          success: 'Votre réponse a bien été enregistrée.',
        }),
      (e) => {
        logger.error(e)
        return Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: `Votre réponse n'a pas pu être prise en compte:  ${e.message}`,
        })
      }
    )
  }

  try {
    await deleteFile(request.file.path)
  } catch (error) {
    logger.error(error)
  }

  return Redirect(ROUTES.DEMANDE_PAGE_DETAILS(modificationRequestId), {
    error: 'Impossible de répondre à ce type de demande pour le moment.',
  })
}

export { postReplyToModificationRequest }
