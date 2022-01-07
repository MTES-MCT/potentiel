import { request } from 'express'
import asyncHandler from 'express-async-handler'
import fs from 'fs'
import moment from 'moment-timezone'
import {
  acceptModificationRequest,
  ensureRole,
  rejectModificationRequest,
  requestConfirmation,
  updateModificationRequestStatus,
} from '../../config'
import { logger } from '../../core/utils'
import { addQueryParams } from '../../helpers/addQueryParams'
import { isDateFormatValid, isStrictlyPositiveNumber } from '../../helpers/formValidators'
import { pathExists } from '../../helpers/pathExists'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import {
  ModificationRequestAcceptanceParams,
  PuissanceVariationWithDecisionJusticeError,
} from '../../modules/modificationRequest'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '../../modules/shared'
import routes from '../../routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

const FORMAT_DATE = 'DD/MM/YYYY'

v1Router.post(
  routes.ADMIN_REPLY_TO_MODIFICATION_REQUEST,

  upload.single('file'),
  ensureRole(['admin', 'dgec', 'dreal']),
  asyncHandler(async (request, response) => {
    const {
      modificationRequestId,
      type,
      versionDate,
      submitAccept,
      submitConfirm,
      statusUpdateOnly,
      newNotificationDate,
      delayInMonths,
      puissance,
      isDecisionJustice,
      replyWithoutAttachment,
      actionnaire,
    } = request.body

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    // There are two submit buttons on the form, named submitAccept and submitReject
    // We know which one has been clicked when it has a string value
    const acceptedReply = typeof submitAccept === 'string'
    const confirmReply = typeof submitConfirm === 'string'

    if (statusUpdateOnly) {
      if (confirmReply) {
        return response.redirect(
          addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
            error: `Votre réponse n'a pas pu être prise en compte parce qu'il n'est pas possible de demander une confirmation si la demande a été traitée en dehors de Potentiel.`,
          })
        )
      }

      const newStatus = acceptedReply ? 'acceptée' : 'rejetée'

      return await updateModificationRequestStatus({
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        newStatus,
        submittedBy: request.user,
      }).match(
        _handleSuccess(response, modificationRequestId),
        _handleErrors(request, response, modificationRequestId)
      )
    }

    if (type === 'recours' && !isDateFormatValid(newNotificationDate, FORMAT_DATE)) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: "La réponse n'a pas pu être envoyée: la date de notification est erronnée.",
        })
      )
    }

    if (type === 'delai' && !isStrictlyPositiveNumber(delayInMonths)) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée: le délai accordé doit être un nombre supérieur à 0.",
        })
      )
    }

    if (type === 'puissance' && !isStrictlyPositiveNumber(puissance)) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée: la puissance doit être un nombre supérieur à 0.",
        })
      )
    }

    const courrierReponseExists: boolean = !!request.file && (await pathExists(request.file.path))

    const courrierReponseIsOk =
      courrierReponseExists || (acceptedReply && (isDecisionJustice || replyWithoutAttachment))

    if (!courrierReponseIsOk) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: "La réponse n'a pas pu être envoyée car il manque le courrier de réponse.",
        })
      )
    }

    const responseFile = request.file && {
      contents: fs.createReadStream(request.file.path),
      filename: request.file.originalname,
    }

    if (acceptedReply) {
      return await acceptModificationRequest({
        responseFile,
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        acceptanceParams: _makeAcceptanceParams(type, {
          newNotificationDate:
            newNotificationDate &&
            moment(newNotificationDate, FORMAT_DATE).tz('Europe/Paris').toDate(),
          delayInMonths: delayInMonths && Number(delayInMonths),
          newPuissance: Number(puissance),
          isDecisionJustice: Boolean(isDecisionJustice),
          newActionnaire: actionnaire,
        })!,
        submittedBy: request.user,
      }).match(
        _handleSuccess(response, modificationRequestId),
        _handleErrors(request, response, modificationRequestId)
      )
    }

    if (confirmReply) {
      return await requestConfirmation({
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        responseFile: {
          contents: fs.createReadStream(request.file!.path),
          filename: request.file!.originalname,
        },
        confirmationRequestedBy: request.user,
      }).match(
        _handleSuccess(response, modificationRequestId),
        _handleErrors(request, response, modificationRequestId)
      )
    }

    return rejectModificationRequest({
      responseFile,
      modificationRequestId,
      versionDate: new Date(Number(versionDate)),
      rejectedBy: request.user,
    }).match(
      _handleSuccess(response, modificationRequestId),
      _handleErrors(request, response, modificationRequestId)
    )
  })
)

function _handleSuccess(response, modificationRequestId) {
  return () => {
    response.redirect(
      routes.SUCCESS_OR_ERROR_PAGE({
        success: 'Votre réponse a bien été enregistrée.',
        redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
        redirectTitle: 'Retourner à la demande',
      })
    )
  }
}

function _handleErrors(request, response, modificationRequestId) {
  return (e) => {
    if (e instanceof AggregateHasBeenUpdatedSinceError) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: `Votre réponse n'a pas pu être prise en compte parce que la demande a été mise à jour entre temps. Merci de réessayer.`,
        })
      )
    }

    if (e instanceof PuissanceVariationWithDecisionJusticeError) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: e.message,
        })
      )
    }

    if (e instanceof EntityNotFoundError) {
      return notFoundResponse({ request, response })
    }

    if (e instanceof UnauthorizedError) {
      return unauthorizedResponse({ request, response })
    }

    logger.error(e)

    return errorResponse({ request, response })
  }
}

function _makeAcceptanceParams(
  type: string,
  params: any
): ModificationRequestAcceptanceParams | undefined {
  const {
    newNotificationDate,
    delayInMonths,
    newPuissance,
    isDecisionJustice,
    newActionnaire,
    newProducteur,
  } = params
  switch (type) {
    case 'recours':
      return {
        type,
        newNotificationDate,
      }
    case 'delai':
      return { type, delayInMonths }
    case 'puissance':
      return { type, newPuissance, isDecisionJustice }
    case 'actionnaire':
      return { type, newActionnaire }
    case 'producteur':
      return { type, newProducteur }
  }
}
