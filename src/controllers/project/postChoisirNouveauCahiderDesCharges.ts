import { ensureRole, choisirNouveauCahierDesCharges } from '@config'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'
import {
  errorResponse,
  RequestValidationError,
  unauthorizedResponse,
  notFoundResponse,
} from '../helpers'
import { v1Router } from '../v1Router'
import * as yup from 'yup'
import { NouveauCahierDesChargesDéjàSouscrit } from '@modules/project'
import safeAsyncHandler from '../helpers/safeAsyncHandler'

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    redirectUrl: yup.string().required(),
  }),
})

v1Router.post(
  routes.CHANGER_CDC,
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        body: { projectId, redirectUrl },
        user,
      } = request

      return choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
      }).match(
        () =>
          response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success:
                "Votre demande de changement de modalités d'instructions a bien été enregistrée.",
              redirectUrl,
              redirectTitle: 'Retourner sur la page précédente',
            })
          ),
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          if (
            error instanceof RequestValidationError ||
            error instanceof NouveauCahierDesChargesDéjàSouscrit
          ) {
            return errorResponse({
              request,
              response,
              customMessage:
                'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
            })
          }

          logger.error(error)
          return errorResponse({ request, response })
        }
      )
    }
  )
)
