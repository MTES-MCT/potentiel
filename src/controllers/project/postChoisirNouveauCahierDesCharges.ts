import { ensureRole, choisirNouveauCahierDesCharges } from '@config'
import { logger } from '@core/utils'
import { UnauthorizedError } from '@modules/shared'
import routes from '@routes'
import { errorResponse, unauthorizedResponse } from '../helpers'
import { v1Router } from '../v1Router'
import * as yup from 'yup'
import {
  CahierDesChargesNonDisponibleError,
  NouveauCahierDesChargesDéjàSouscrit,
  PasDeChangementDeCDCPourCetAOError,
} from '@modules/project'
import { ModificationRequestType } from '@modules/modificationRequest'
import safeAsyncHandler from '../helpers/safeAsyncHandler'

const choixCDC = ['30/07/2021', '30/08/2022', '30/08/2022-alternatif'] as const
type ChoixCahierDesCharges = typeof choixCDC[number]

const schema = yup.object({
  body: yup.object({
    projectId: yup.string().uuid().required(),
    redirectUrl: yup.string().required(),
    type: yup
      .mixed<ModificationRequestType>()
      .oneOf([
        'actionnaire',
        'fournisseur',
        'producteur',
        'puissance',
        'recours',
        'abandon',
        'delai',
      ])
      .optional(),
    choixCDC: yup.mixed<ChoixCahierDesCharges>().oneOf(choixCDC.slice()).required(),
    identifiantGestionnaireRéseau: yup.string().optional(),
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

const mapVersChoixCahierDesCharges = (
  cdc: ChoixCahierDesCharges
): { paruLe: '30/07/2021' | '30/08/2022'; alternatif?: true } => {
  switch (cdc) {
    case '30/07/2021':
      return {
        paruLe: '30/07/2021',
      }
    case '30/08/2022':
      return {
        paruLe: '30/08/2022',
      }
    case '30/08/2022-alternatif': {
      return {
        paruLe: '30/08/2022',
        alternatif: true,
      }
    }
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
        body: { projectId, redirectUrl, type, choixCDC, identifiantGestionnaireRéseau },
        user,
      } = request

      return choisirNouveauCahierDesCharges({
        projetId: projectId,
        utilisateur: user,
        cahierDesCharges: mapVersChoixCahierDesCharges(choixCDC),
        identifiantGestionnaireRéseau,
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

          if (
            error instanceof NouveauCahierDesChargesDéjàSouscrit ||
            error instanceof PasDeChangementDeCDCPourCetAOError ||
            error instanceof CahierDesChargesNonDisponibleError
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
