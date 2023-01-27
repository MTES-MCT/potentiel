import * as yup from 'yup'
import { createReadStream } from 'fs'
import {
  accorderChangementDePuissance,
  ensureRole,
  getModificationRequestAuthority,
  rejeterChangementDePuissance,
  updateModificationRequestStatus,
} from '@config'
import { isStrictlyPositiveNumber, logger } from '@core/utils'
import { addQueryParams } from '../../../helpers/addQueryParams'
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
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import safeAsyncHandler from '../../helpers/safeAsyncHandler'
import { UniqueEntityID } from '@core/domain'

const _handleSuccess = (response, modificationRequestId) => () => {
  response.redirect(
    routes.SUCCESS_OR_ERROR_PAGE({
      success: 'Votre réponse a bien été enregistrée.',
      redirectUrl: routes.DEMANDE_PAGE_DETAILS(modificationRequestId),
      redirectTitle: 'Retourner à la demande',
    })
  )
}

const _handleErrors = (request, response, modificationRequestId) => (e) => {
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

const schema = yup.object({
  body: yup.object({
    modificationRequestId: yup.string().uuid().required(),
    versionDate: yup.string().required(),
    submitAccept: yup.string().nullable(),
    submitRefuse: yup.string().nullable(),
    isDecisionJustice: yup.boolean(),
    statusUpdateOnly: yup.string().nullable(),
    puissance: yup.string().required('La puissance est obligatoire'),
  }),
})

v1Router.post(
  routes.POST_REPONDRE_DEMANDE_CHANGEMENT_PUISSANCE,
  ensureRole(['admin', 'dgec-validateur', 'dreal']),
  upload.single('file'),
  safeAsyncHandler(
    {
      schema,
      onError: ({
        request: {
          body: { modificationRequestId },
        },
        response,
        error,
      }) =>
        response.redirect(
          addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
            ...error.errors,
          })
        ),
    },
    async (request, response) => {
      const {
        file,
        user: { role },
        body: {
          modificationRequestId,
          versionDate,
          submitAccept,
          statusUpdateOnly,
          puissance,
          isDecisionJustice,
        },
      } = request

      if (role === 'dreal') {
        const authority = await getModificationRequestAuthority(modificationRequestId)
        if (authority && authority !== role) {
          return unauthorizedResponse({ request, response })
        }
      }

      const estAccordé = typeof submitAccept === 'string'

      if (statusUpdateOnly) {
        return await updateModificationRequestStatus({
          modificationRequestId: new UniqueEntityID(modificationRequestId),
          versionDate: new Date(Number(versionDate)),
          newStatus: estAccordé ? 'acceptée' : 'rejetée',
          submittedBy: request.user,
        }).match(
          _handleSuccess(response, modificationRequestId),
          _handleErrors(request, response, modificationRequestId)
        )
      }

      if (!isStrictlyPositiveNumber(Number(puissance))) {
        return response.redirect(
          addQueryParams(routes.DEMANDE_PAGE_DETAILS(modificationRequestId), {
            error:
              "La réponse n'a pas pu être envoyée: la puissance doit être un nombre supérieur à 0.",
          })
        )
      }

      const fichierRéponse = file && {
        contents: createReadStream(file.path),
        filename: file.originalname,
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

      if (estAccordé) {
        return await accorderChangementDePuissance({
          responseFile: fichierRéponse,
          demandeId: new UniqueEntityID(modificationRequestId),
          versionDate: new Date(Number(versionDate)),
          paramètres: {
            type: 'puissance',
            newPuissance: Number(puissance),
            isDecisionJustice,
          },
          utilisateur: request.user,
        }).match(
          _handleSuccess(response, modificationRequestId),
          _handleErrors(request, response, modificationRequestId)
        )
      }

      return rejeterChangementDePuissance({
        demandeId: new UniqueEntityID(modificationRequestId),
        fichierRéponse,
        versionDate: new Date(Number(versionDate)),
        utilisateur: request.user,
      }).match(
        _handleSuccess(response, modificationRequestId),
        _handleErrors(request, response, modificationRequestId)
      )
    }
  )
)
