import fs from 'fs'
import omit from 'lodash/omit'
import * as yup from 'yup'

import { ensureRole, changerProducteur } from '@config'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'

import { addQueryParams } from '../../../helpers/addQueryParams'
import { errorResponse, unauthorizedResponse } from '../../helpers'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import { ChangementProducteurImpossiblePourEolienError } from '@modules/project/errors'
import { NouveauCahierDesChargesNonChoisiError } from '@modules/demandeModification'
import safeAsyncHandler from '../../helpers/safeAsyncHandler'

const schema = yup.object({
  body: yup.object({
    projetId: yup.string().uuid().required(),
    nouvellesRèglesDInstructionChoisies: yup.boolean().optional(),
    producteur: yup.string().required('Le champ "nouveau producteur" est obligatoire.'),
    justification: yup.string().optional(),
  }),
})

v1Router.post(
  routes.CHANGEMENT_PRODUCTEUR_ACTION,
  upload.single('file'),
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) => {
        return response.redirect(
          addQueryParams(routes.DEMANDER_DELAI(request.body.projetId), {
            ...omit(request.body, 'projectId'),
            error: `${error.message} ${error.errors.join(' ')}`,
          })
        )
      },
    },
    async (request, response) => {
      const { user } = request
      const { projetId, justification, producteur } = request.body

      const fichier = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      }

      return changerProducteur({
        porteur: user,
        projetId,
        ...(fichier && { fichier }),
        ...(justification && { justification }),
        nouveauProducteur: producteur,
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: `Votre changement de producteur a bien été enregistré. Vous n'avez plus accès au projet sur Potentiel.`,
              redirectUrl: routes.USER_LIST_PROJECTS,
              redirectTitle: 'Retourner à la liste des mes projets',
            })
          )
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          if (
            error instanceof ChangementProducteurImpossiblePourEolienError ||
            NouveauCahierDesChargesNonChoisiError
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
    }
  )
)
