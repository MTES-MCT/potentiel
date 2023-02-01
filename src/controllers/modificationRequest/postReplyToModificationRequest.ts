import fs from 'fs'
import {
  acceptModificationRequest,
  ensureRole,
  rejectModificationRequest,
  requestConfirmation,
  updateModificationRequestStatus,
} from '@config'
import { logger } from '@core/utils'
import { getModificationRequestAuthority } from '@infra/sequelize/queries'
import { addQueryParams } from '../../helpers/addQueryParams'
import { isDateFormatValid } from '../../helpers/formValidators'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import {
  ModificationRequestAcceptanceParams,
  ProjetDéjàClasséError,
} from '@modules/modificationRequest'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '@modules/shared'
import routes from '@routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { upload } from '../upload'
import { v1Router } from '../v1Router'
import moment from 'moment'

const FORMAT_DATE = 'DD/MM/YYYY'

v1Router.post(
  routes.ADMIN_REPLY_TO_MODIFICATION_REQUEST,

  upload.single('file'),
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  asyncHandler(async (request, response) => {
    const {
      user: { role },
      body: {
        modificationRequestId,
        type,
        versionDate,
        submitAccept,
        submitConfirm,
        statusUpdateOnly,
        newNotificationDate,
        isDecisionJustice,
        actionnaire,
        producteur,
      },
    } = request

    if (!validateUniqueId(modificationRequestId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Demande' })
    }

    if (role === 'dreal') {
      const authority = await getModificationRequestAuthority(modificationRequestId)

      if (authority && authority !== role) {
        return unauthorizedResponse({ request, response })
      }
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

    const responseFile = request.file && {
      contents: fs.createReadStream(request.file.path),
      filename: request.file.originalname,
    }

    const courrierReponseIsOk = responseFile || (acceptedReply && isDecisionJustice)

    if (!courrierReponseIsOk) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
        })
      )
    }

    let acceptanceParams: ModificationRequestAcceptanceParams | undefined
    switch (type) {
      case 'recours':
        acceptanceParams = {
          type,
          newNotificationDate: moment(newNotificationDate, 'DD/MM/YYYY')
            .tz('Europe/London')
            .toDate(),
        }
        break
      case 'actionnaire':
        acceptanceParams = { type, newActionnaire: actionnaire }
        break
      case 'producteur':
        acceptanceParams = { type, newProducteur: producteur }
        break
    }

    if (type !== 'abandon' && !acceptanceParams) {
      return errorResponse({ request, response })
    }

    if (acceptedReply) {
      return await acceptModificationRequest({
        responseFile,
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        acceptanceParams,
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
        responseFile: responseFile!,
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

    if (e instanceof ProjetDéjàClasséError) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error: `Vous ne pouvez pas accepter cette demande de recours car le projet est déjà "classé". Le porteur a la possibilité d'annuler sa demande, ou bien vous pouvez la rejeter.`,
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
