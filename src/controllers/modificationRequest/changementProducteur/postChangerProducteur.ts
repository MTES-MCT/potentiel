import fs from 'fs'
import omit from 'lodash/omit'
import * as yup from 'yup'

import { ensureRole, changerProducteur, choisirNouveauCahierDesCharges } from '@config'
import { logger, okAsync } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'

import { addQueryParams } from '../../../helpers/addQueryParams'
import {
  errorResponse,
  RequestValidationErrorArray,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
} from '../../helpers'
import asyncHandler from '../../helpers/asyncHandler'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import {
  ChangementProducteurImpossiblePourEolienError,
  NouveauCahierDesChargesDéjàSouscrit,
  PasDeChangementDeCDCPourCetAOError,
} from '@modules/project/errors'
import { NouveauCahierDesChargesNonChoisiError } from '@modules/demandeModification'

const requestBodySchema = yup.object({
  projetId: yup.string().uuid().required(),
  newRulesOptIn: yup.boolean().optional(),
  producteur: yup.string().required('Le champ producteur est obligatoire.'),
  email: yup.string().email().optional(),
  justification: yup.string().optional(),
})

v1Router.post(
  routes.CHANGEMENT_PRODUCTEUR_ACTION,
  upload.single('file'),
  ensureRole('porteur-projet'),
  asyncHandler((request, response) =>
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { projetId, newRulesOptIn, producteur, email, justification } = body
        const { user } = request

        const fichier = request.file && {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        }

        if (newRulesOptIn) {
          return choisirNouveauCahierDesCharges({
            utilisateur: user,
            projetId,
          }).map(() => ({ fichier, producteur, email, justification, user, projetId }))
        }
        return okAsync({ fichier, producteur, email, justification, user, projetId })
      })
      .andThen(({ fichier, producteur, email, justification, user, projetId }) => {
        return changerProducteur({
          porteur: user,
          projetId,
          ...(fichier && { fichier }),
          ...(justification && { justification }),
          nouveauProducteur: producteur,
          ...(email && { email }),
        }).map(() => projetId)
      })
      .match(
        (projetId) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Votre changement de producteur a bien été enregistré.',
              redirectUrl: routes.PROJECT_DETAILS(projetId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.DEMANDER_DELAI(request.body.projectId), {
                ...omit(request.body, 'projectId'),
                error: `${error.message} ${error.errors.join(' ')}`,
              })
            )
          }

          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          if (
            error instanceof ChangementProducteurImpossiblePourEolienError ||
            NouveauCahierDesChargesNonChoisiError ||
            NouveauCahierDesChargesDéjàSouscrit ||
            PasDeChangementDeCDCPourCetAOError
          ) {
            return errorResponse({
              request,
              response,
              customMessage: error.message,
            })
          }

          logger.error(error)
          return errorResponse({
            request,
            response,
            customMessage:
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          })
        }
      )
  )
)
