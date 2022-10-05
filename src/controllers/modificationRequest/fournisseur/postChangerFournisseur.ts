import { ensureRole, requestFournisseurModification } from '@config'
import { logger } from '@core/utils'
import { CHAMPS_FOURNISSEURS, Fournisseur, isFournisseurKind } from '@modules/project'
import routes from '@routes'
import fs from 'fs'
import { errorResponse, unauthorizedResponse } from '../../helpers'
import { upload } from '../../upload'
import { v1Router } from '../../v1Router'
import * as yup from 'yup'
import { UniqueEntityID } from '@core/domain'
import { addQueryParams } from '../../../helpers/addQueryParams'
import { UnauthorizedError } from '@modules/shared'
import safeAsyncHandler from '../../helpers/safeAsyncHandler'

const schema = yup.object({
  body: yup
    .object({
      projectId: yup.string().uuid().required(),
      evaluationCarbone: yup
        .number()
        .min(0)
        .nullable(true)
        .transform((v, o) => (o === '' ? null : v)),
      justification: yup.string().optional(),
      newRulesOptIn: yup.boolean().optional(),
      ...CHAMPS_FOURNISSEURS.reduce((acc, champ) => {
        const champEchappé = champ.replace(/\n/g, '\\n')
        return {
          [champEchappé]: yup
            .string()
            .typeError(`Les champs fournisseurs doivent comporter du texte.`)
            .optional(),
          ...acc,
        }
      }, {}),
    })
    .test(
      'vérification-globale-fournisseurs',
      `Vous devez modifier au moins l'un des fournisseurs.`,
      (fields) =>
        CHAMPS_FOURNISSEURS.reduce((nombreDeFournisseursChangés, champ) => {
          const champEchappé = champ.replace(/\n/g, '\\n')
          return fields[champEchappé] !== ''
            ? nombreDeFournisseursChangés + 1
            : nombreDeFournisseursChangés
        }, 0) > 0
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
      const { projectId, evaluationCarbone, justification } = request.body
      const file = request.file && {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      }

      const newFournisseurs = getFournisseurs(request.body)

      return requestFournisseurModification({
        projectId: new UniqueEntityID(projectId),
        requestedBy: user,
        newFournisseurs,
        ...(evaluationCarbone && { newEvaluationCarbone: evaluationCarbone }),
        justification,
        file,
      }).match(
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
  Object.entries(validatedBody).reduce((fournisseurs, [key, value]) => {
    const originalKey = key.replace('\\n', '\n')
    return typeof value === 'string' && value !== '' && isFournisseurKind(originalKey)
      ? [...fournisseurs, { kind: originalKey, name: value }]
      : fournisseurs
  }, [])
