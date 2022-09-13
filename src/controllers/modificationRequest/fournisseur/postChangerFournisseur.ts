import { ensureRole, requestFournisseurModification, choisirNouveauCahierDesCharges } from '@config'
import { logger, ok, okAsync } from '@core/utils'
import {
  Fournisseur,
  isFournisseurKind,
  NouveauCahierDesChargesDéjàSouscrit,
  PasDeChangementDeCDCPourCetAOError,
} from '@modules/project'
import routes from '@routes'
import fs from 'fs'
import { errorResponse, unauthorizedResponse } from '../../helpers'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import * as yup from 'yup'
import { UniqueEntityID } from '@core/domain'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { UnauthorizedError } from '@modules/shared'
import safeAsyncHandler from 'src/controllers/helpers/safeAsyncHandler'

const schema = yup.object({
  body: yup
    .object({
      projectId: yup.string().uuid().required(),
      newEvaluationCarbone: yup
        .number()
        .typeError('Le champ Evaluation carbone doit contenir un nombre.')
        .min(0, 'Le champ Evaluation Carbone doit contenir un nombre strictement positif.')
        .optional(),
      justification: yup.string().optional(),
      newRulesOptIn: yup.boolean().optional(),
      'Fournisseur modules ou films': yup.string().optional(),
      'Fournisseur cellules': yup.string().optional(),
      'Fournisseur plaquettes de silicium (wafers)': yup.string().optional(),
      'Fournisseur polysilicium': yup.string().optional(),
      'Fournisseur postes de conversion': yup.string().optional(),
      'Fournisseur structure': yup.string().optional(),
      'Fournisseur dispositifs de stockage de l’énergie': yup.string().optional(),
      'Fournisseur dispositifs de suivi de la course du soleil': yup.string().optional(),
      'Fournisseur autres technologies': yup.string().optional(),
    })
    .test(
      'vérification-globale-fournisseurs',
      `Vous devez modifier au moins l'un des fournisseurs.`,
      function (fields) {
        return (
          !!fields['Fournisseur modules ou films'] ||
          !!fields['Fournisseur cellules'] ||
          !!fields['Fournisseur plaquettes de silicium (wafers)'] ||
          !!fields['Fournisseur polysilicium'] ||
          !!fields['Fournisseur postes de conversion'] ||
          !!fields['Fournisseur structure'] ||
          !!fields['Fournisseur dispositifs de stockage de l’énergie'] ||
          !!fields['Fournisseur dispositifs de suivi de la course du soleil'] ||
          !!fields['Fournisseur autres technologies']
        )
      }
    ),
})

v1Router.post(
  routes.CHANGEMENT_FOURNISSEUR_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(routes.CHANGER_FOURNISSEUR(request.body.projectId), {
            error: `${error.errors.join(' ')}`,
          })
        ),
    },
    async (request, response) => {
      const { user } = request
      const { newRulesOptIn, projectId, newEvaluationCarbone, justification } = request.body
      const file = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      }

      return ok(null)
        .asyncAndThen(() => {
          if (newRulesOptIn) {
            return choisirNouveauCahierDesCharges({
              utilisateur: user,
              projetId: projectId,
            })
          }
          return okAsync(null)
        })
        .andThen(() =>
          requestFournisseurModification({
            projectId: new UniqueEntityID(projectId),
            requestedBy: user,
            newFournisseurs: getFournisseurs(request.body),
            newEvaluationCarbone,
            justification,
            file,
          })
        )
        .match(
          () =>
            response.redirect(
              routes.SUCCESS_OR_ERROR_PAGE({
                success: 'Vos changements ont bien été enregistrés.',
                redirectUrl: routes.PROJECT_DETAILS(projectId),
                redirectTitle: 'Retourner à la page projet',
              })
            ),
          (error) => {
            if (error instanceof UnauthorizedError) {
              return unauthorizedResponse({ request, response })
            }
            if (
              error instanceof
              (NouveauCahierDesChargesDéjàSouscrit || PasDeChangementDeCDCPourCetAOError)
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

const getFournisseurs = (validatedBody: yup.InferType<typeof schema>['body']): Fournisseur[] =>
  Object.entries(validatedBody).reduce(
    (fournisseurs, [key, value]) =>
      typeof value === 'string' && value !== '' && isFournisseurKind(key)
        ? [...fournisseurs, { kind: key, name: value }]
        : fournisseurs,
    []
  )
