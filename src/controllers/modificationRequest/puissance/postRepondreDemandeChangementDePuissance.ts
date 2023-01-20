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
import { addQueryParams } from '../../../helpers/addQueryParams'
import { isStrictlyPositiveNumber } from '../../../helpers/formValidators'
import { validateUniqueId } from '../../../helpers/validateUniqueId'
import {
  ProjetDéjàClasséError,
  PuissanceVariationWithDecisionJusticeError,
} from '@modules/modificationRequest'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '@modules/shared'
import routes from '@routes'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../../helpers'
import asyncHandler from '../../helpers/asyncHandler'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'

v1Router.post(
  routes.POST_REPONDRE_DEMANDE_CHANGEMENT_PUISSANCE,
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    // validateRequestBodyForErrorArray(request.body, requestBodySchema)
    const {
      user: { role },
      body: {
        modificationRequestId,
        type,
        versionDate,
        submitAccept,
        submitConfirm,
        statusUpdateOnly,
        puissance,
        isDecisionJustice,
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
    const estAccordé = typeof submitAccept === 'string'
    const demanderConfirmation = typeof submitConfirm === 'string'

    if (statusUpdateOnly) {
      if (demanderConfirmation) {
        return response.redirect(
          addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
            error: `Votre réponse n'a pas pu être prise en compte parce qu'il n'est pas possible de demander une confirmation si la demande a été traitée en dehors de Potentiel.`,
          })
        )
      }

      const newStatus = estAccordé ? 'acceptée' : 'rejetée'

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

    if (!isStrictlyPositiveNumber(puissance)) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée: la puissance doit être un nombre supérieur à 0.",
        })
      )
    }

    const fichierRéponse = request.file && {
      contents: fs.createReadStream(request.file.path),
      filename: request.file.originalname,
    }

    const courrierReponseIsOk = fichierRéponse || (estAccordé && isDecisionJustice)

    if (!courrierReponseIsOk) {
      return response.redirect(
        addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
          error:
            "La réponse n'a pas pu être envoyée car il manque le courrier de réponse (obligatoire pour cette réponse).",
        })
      )
    }
    const acceptanceParams = { type, newPuissance: puissance, isDecisionJustice }

    if (!acceptanceParams) {
      return errorResponse({ request, response })
    }

    if (estAccordé) {
      return await acceptModificationRequest({
        responseFile: fichierRéponse,
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        acceptanceParams,
        submittedBy: request.user,
      }).match(
        _handleSuccess(response, modificationRequestId),
        _handleErrors(request, response, modificationRequestId)
      )
    }

    if (demanderConfirmation) {
      return await requestConfirmation({
        modificationRequestId,
        versionDate: new Date(Number(versionDate)),
        responseFile: fichierRéponse!,
        confirmationRequestedBy: request.user,
      }).match(
        _handleSuccess(response, modificationRequestId),
        _handleErrors(request, response, modificationRequestId)
      )
    }

    return rejectModificationRequest({
      responseFile: fichierRéponse,
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
