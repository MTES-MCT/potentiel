import { ensureRole, choisirNouveauCahierDesCharges } from '@config'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import * as yup from 'yup'
import { NouveauCahierDesChargesDéjàSouscrit } from '@modules/project'
import { ModificationRequestType } from '@modules/modificationRequest'
import safeAsyncHandler from '../helpers/safeAsyncHandler'
import { parseCahierDesChargesActuel } from '@entities'

const modificationRequestTypes = [
  'actionnaire',
  'fournisseur',
  'producteur',
  'puissance',
  'recours',
  'abandon',
  'delai',
]

const cahierDesCharges = ['initial', '30/07/2021', '30/08/2022', '30/08/2022-alternatif']

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    redirectUrl: yup.string().required(),
    type: yup.mixed().oneOf(modificationRequestTypes).optional(),
    cahierDesCharges: yup.mixed().oneOf(cahierDesCharges).required(),
  }),
})

const getRedirectTitle = (type: ModificationRequestType) => {
  switch (type) {
    case 'delai':
    case 'recours':
      return `Retourner sur la demande de ${type === 'delai' ? 'délai' : type}`
    case 'abandon':
      return `Retourner sur la demande d'${type}`
    case 'puissance':
    case 'fournisseur':
    case 'producteur':
      return `Retourner sur la demande de changement de ${type}`
    default:
      return 'Retourner sur la page du projet'
  }
}

v1Router.post(
  routes.CHANGER_CDC,
  ensureRole('porteur-projet'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        errorResponse({
          request,
          response,
          customMessage:
            'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
        }),
    },
    async (request, response) => {
      const {
        body: { projectId, redirectUrl, type, cahierDesCharges },
        user,
      } = request

      return choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: parseCahierDesChargesActuel(cahierDesCharges),
      }).match(
        () => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success:
                "Votre demande de changement de modalités d'instructions a bien été enregistrée.",
              redirectUrl,
              redirectTitle: getRedirectTitle(type),
            })
          )
        },
        (error) => {
          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
          }

          if (error instanceof NouveauCahierDesChargesDéjàSouscrit) {
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
