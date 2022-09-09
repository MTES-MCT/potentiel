import { ensureRole, requestFournisseurModification, choisirNouveauCahierDesCharges } from '@config'
import { errAsync, logger, okAsync } from '@core/utils'
import { Fournisseur, FournisseurKind } from '@modules/project'
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

const requestBodySchema = yup.object({
  projectId: yup.string().uuid().required(),
  newEvaluationCarbone: yup.number().positive().optional(),
  justification: yup.string().optional(),
  newRulesOptIn: yup.boolean().optional(),
  'Nom du fabricant \\n(Modules ou films)': yup.string().optional(),
  'Nom du fabricant (Cellules)': yup.string().optional(),
  'Nom du fabricant \\n(Plaquettes de silicium (wafers))': yup.string().optional(),
  'Nom du fabricant \\n(Polysilicium)': yup.string().optional(),
  'Nom du fabricant \\n(Postes de conversion)': yup.string().optional(),
  'Nom du fabricant \\n(Structure)': yup.string().optional(),
  'Nom du fabricant \\n(Dispositifs de stockage de l’énergie *)': yup.string().optional(),
  'Nom du fabricant \\n(Dispositifs de suivi de la course du soleil *)': yup.string().optional(),
  'Nom du fabricant \\n(Autres technologies)': yup.string().optional(),
})

v1Router.post(
  routes.CHANGEMENT_FOURNISSEUR_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    validateRequestBodyForErrorArray(request.body, requestBodySchema)
      .asyncAndThen((body) => {
        const { user } = request

        const nouveauxFournisseurs = getFournisseurs(body)

        if (!nouveauxFournisseurs?.length) {
          return errAsync(new ChampFournisseurManquantError())
        }
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
              success: 'Votre demande de délai a bien été envoyée.',
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

function getFournisseurs(validatedBody: any): Fournisseur[] | [] {
  return [
    {
      kind: 'Nom du fabricant \n(Modules ou films)' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Modules ou films)'],
    },
    {
      kind: 'Nom du fabricant (Cellules)' as FournisseurKind,
      name: validatedBody['Nom du fabricant (Cellules)'],
    },
    {
      kind: 'Nom du fabricant \n(Plaquettes de silicium (wafers))' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Plaquettes de silicium (wafers))'],
    },
    {
      kind: 'Nom du fabricant \n(Polysilicium)' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Polysilicium)'],
    },
    {
      kind: 'Nom du fabricant \n(Postes de conversion)' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Postes de conversion)'],
    },
    {
      kind: 'Nom du fabricant \n(Structure)' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Structure)'],
    },
    {
      kind: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Dispositifs de stockage de l’énergie *)'],
    },
    {
      kind: 'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Dispositifs de suivi de la course du soleil *)'],
    },
    {
      kind: 'Nom du fabricant \n(Autres technologies)' as FournisseurKind,
      name: validatedBody['Nom du fabricant \\n(Autres technologies)'],
    },
  ].filter(({ name }) => name)
}
