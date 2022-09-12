import { ensureRole, requestFournisseurModification, choisirNouveauCahierDesCharges } from '@config'
import { logger, okAsync } from '@core/utils'
import { Fournisseur, isFournisseurKind } from '@modules/project'
import routes from '@routes'
import fs from 'fs'
import {
  errorResponse,
  RequestValidationErrorArray,
  unauthorizedResponse,
  validateRequestBodyForErrorArray,
} from '../../helpers'
import asyncHandler from '../../helpers/asyncHandler'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import * as yup from 'yup'
import { UniqueEntityID } from '@core/domain'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { ChampFournisseurManquantError } from '@modules/shared/errors/ChampFournisseurManquantError'
import { UnauthorizedError } from '@modules/shared'

type RequestBodyType = {
  projectId: string
  newEvaluationCarbone: number | undefined
  justification: string | undefined
  newRulesOptIn: boolean | undefined
  'Fournisseur modules ou films': string | undefined
  'Fournisseur cellules': string | undefined
  'Fournisseur plaquettes de silicium (wafers)': string | undefined
  'Fournisseur polysilicium': string | undefined
  'Fournisseur postes de conversion': string | undefined
  'Fournisseur structure': string | undefined
  'Fournisseur dispositifs de stockage de l’énergie': string | undefined
  'Fournisseur dispositifs de suivi de la course du soleil': string | undefined
  'Fournisseur autres technologies': string | undefined
}

const requestBodySchema: yup.SchemaOf<RequestBodyType> = yup
  .object({
    projectId: yup.string().uuid().required(),
    newEvaluationCarbone: yup.number().positive().optional(),
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
  )

v1Router.post(
  routes.CHANGEMENT_FOURNISSEUR_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request

        const file = request.file && {
          contents: fs.createReadStream(request.file.path),
          filename: `${Date.now()}-${request.file.originalname}`,
        }

        if (body.newRulesOptIn) {
          return choisirNouveauCahierDesCharges({
            utilisateur: user,
            projetId: body.projectId,
          }).map(() => ({ user, file, ...body }))
        }
        return okAsync({ user, file, ...body })
      })
      .andThen(({ user, file, ...body }) => {
        const { projectId, justification, newEvaluationCarbone } = body
        return requestFournisseurModification({
          projectId: new UniqueEntityID(projectId),
          requestedBy: user,
          newFournisseurs: getFournisseurs(body),
          newEvaluationCarbone,
          justification,
          file,
        }).map(() => ({ projectId }))
      })
      .match(
        ({ projectId }) => {
          return response.redirect(
            routes.SUCCESS_OR_ERROR_PAGE({
              success: 'Vos changements ont bien été enregistrés.',
              redirectUrl: routes.PROJECT_DETAILS(projectId),
              redirectTitle: 'Retourner à la page projet',
            })
          )
        },
        (error) => {
          if (error instanceof RequestValidationErrorArray) {
            return response.redirect(
              addQueryParams(routes.CHANGER_FOURNISSEUR(request.body.projectId), {
                error: `${error.message} ${error.errors.join(' ')}`,
              })
            )
          }

          if (error instanceof ChampFournisseurManquantError) {
            return response.redirect(
              addQueryParams(routes.CHANGER_FOURNISSEUR(request.body.projectId), {
                error: error.message,
              })
            )
          }

          if (error instanceof UnauthorizedError) {
            return unauthorizedResponse({ request, response })
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
  })
)

function getFournisseurs(validatedBody: RequestBodyType): Fournisseur[] {
  let nouveauFournisseurs: Fournisseur[] = []
  for (const [key, value] of Object.entries(validatedBody)) {
    if (typeof value === 'string' && value !== '' && isFournisseurKind(key)) {
      nouveauFournisseurs.push({ kind: key, name: value })
    }
  }
  return nouveauFournisseurs
}
