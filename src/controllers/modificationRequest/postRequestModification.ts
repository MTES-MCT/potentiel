import {
  ensureRole,
  oldProjectRepo,
  requestActionnaireModification,
  requestFournisseurModification,
  requestPuissanceModification,
  choisirNouveauCahierDesCharges,
} from '@config'
import { logger } from '@core/utils'
import { PuissanceJustificationOrCourrierMissingError } from '@modules/modificationRequest'
import { Fournisseur, FournisseurKind } from '@modules/project'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  UnauthorizedError,
} from '@modules/shared'
import routes from '@routes'
import { requestModification, shouldUserAccessProject } from '@useCases'
import fs from 'fs'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { addQueryParams } from '../../helpers/addQueryParams'
import { isStrictlyPositiveNumber } from '../../helpers/formValidators'
import { pathExists } from '../../helpers/pathExists'
import toNumber from '../../helpers/toNumber'
import { validateUniqueId } from '../../helpers/validateUniqueId'
import { errorResponse, notFoundResponse, unauthorizedResponse } from '../helpers'
import asyncHandler from '../helpers/asyncHandler'
import { upload } from '../upload'
import { v1Router } from '../v1Router'

const returnRoute = (type, projectId) => {
  let returnRoute: string
  switch (type) {
    case 'fournisseur':
      returnRoute = routes.CHANGER_FOURNISSEUR(projectId)
      break
    case 'actionnaire':
      returnRoute = routes.CHANGER_ACTIONNAIRE(projectId)
      break
    case 'puissance':
      returnRoute = routes.CHANGER_PUISSANCE(projectId)
      break
    case 'recours':
      returnRoute = routes.DEPOSER_RECOURS(projectId)
      break
    default:
      returnRoute = routes.USER_LIST_PROJECTS
      break
  }
  return returnRoute
}

v1Router.post(
  routes.DEMANDE_ACTION,
  ensureRole('porteur-projet'),
  upload.single('file'),
  asyncHandler(async (request, response) => {
    const { projectId } = request.body

    if (!validateUniqueId(projectId)) {
      return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
    }

    const userAccess = await shouldUserAccessProject({
      projectId,
      user: request.user,
    })

    if (!userAccess) {
      return unauthorizedResponse({ request, response })
    }

    const data = pick(request.body, [
      'type',
      'actionnaire',
      'puissance',
      'justification',
      'projectId',
      'numeroGestionnaire',
      'Nom du fabricant \\n(Modules ou films)',
      'Nom du fabricant (Cellules)',
      'Nom du fabricant \\n(Plaquettes de silicium (wafers))',
      'Nom du fabricant \\n(Polysilicium)',
      'Nom du fabricant \\n(Postes de conversion)',
      'Nom du fabricant \\n(Structure)',
      'Nom du fabricant \\n(Dispositifs de stockage de l’énergie *)',
      'Nom du fabricant \\n(Dispositifs de suivi de la course du soleil *)',
      'Nom du fabricant \\n(Autres technologies)',
      'evaluationCarbone',
      'newRulesOptIn',
    ])

    if (data.type === 'puissance' && !isStrictlyPositiveNumber(data.puissance)) {
      const { projectId, type } = data
      return response.redirect(
        addQueryParams(returnRoute(type, projectId), {
          error: 'Erreur: la puissance n‘est pas valide.',
        })
      )
    }

    if (
      data.type === 'fournisseur' &&
      data.evaluationCarbone &&
      !isStrictlyPositiveNumber(data.evaluationCarbone)
    ) {
      const { projectId, type } = data
      return response.redirect(
        addQueryParams(returnRoute(type, projectId), {
          error: 'Erreur: la valeur de l‘évaluation carbone n‘est pas valide.',
        })
      )
    }

    data.evaluationCarbone = data.evaluationCarbone ? Number(data.evaluationCarbone) : undefined

    let file

    if (request.file) {
      const dirExists: boolean = await pathExists(request.file.path)

      if (!dirExists) {
        const { projectId, type } = data
        return response.redirect(
          addQueryParams(returnRoute(type, projectId), {
            error: "Erreur: la pièce-jointe n'a pas pu être intégrée. Merci de réessayer.",
          })
        )
      }

      file = {
        contents: fs.createReadStream(request.file.path),
        filename: `${Date.now()}-${request.file.originalname}`,
      }
    }

    const handleSuccess = () =>
      response.redirect(
        routes.SUCCESS_OR_ERROR_PAGE({
          success: 'Votre demande a bien été prise en compte.',
          redirectUrl: routes.USER_LIST_REQUESTS,
          redirectTitle: 'Voir mes demandes',
        })
      )

    const handleError = (error) => {
      const { projectId, type } = data
      const redirectRoute = returnRoute(type, projectId)

      if (error instanceof PuissanceJustificationOrCourrierMissingError) {
        return response.redirect(
          addQueryParams(redirectRoute, {
            ...omit(data, 'projectId'),
            error: error.message,
          })
        )
      }

      if (error instanceof AggregateHasBeenUpdatedSinceError) {
        return response.redirect(
          addQueryParams(redirectRoute, {
            ...omit(data, 'projectId'),
            error:
              'Le projet a été modifié entre le moment où vous avez ouvert cette page et le moment où vous avez validé la demande. Merci de prendre en compte le changement et refaire votre demande si nécessaire.',
          })
        )
      }

      if (error instanceof EntityNotFoundError) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' })
      } else if (error instanceof UnauthorizedError) {
        return unauthorizedResponse({ request, response })
      }

      logger.error(error)

      return errorResponse({ request, response })
    }

    const project = await oldProjectRepo.findById(data.projectId)
    if (!project?.newRulesOptIn && project?.appelOffre?.choisirNouveauCahierDesCharges) {
      const res = await choisirNouveauCahierDesCharges({
        projetId: data.projectId,
        utilisateur: request.user,
      })

      if (res.isErr()) return handleError(res.error)
    }

    switch (data.type) {
      case 'puissance':
        await requestPuissanceModification({
          projectId: data.projectId,
          requestedBy: request.user,
          newPuissance: data.puissance && toNumber(data.puissance),
          justification: data.justification,
          file,
        }).match(handleSuccess, handleError)
        break
      case 'actionnaire':
        await requestActionnaireModification({
          projectId: data.projectId,
          requestedBy: request.user,
          newActionnaire: data.actionnaire,
          justification: data.justification,
          file,
        }).match(handleSuccess, handleError)
        break
      case 'fournisseur':
        const newFournisseurs: Fournisseur[] = [
          {
            kind: 'Nom du fabricant \n(Modules ou films)' as FournisseurKind,
            name: data['Nom du fabricant \\n(Modules ou films)'],
          },
          {
            kind: 'Nom du fabricant (Cellules)' as FournisseurKind,
            name: data['Nom du fabricant (Cellules)'],
          },
          {
            kind: 'Nom du fabricant \n(Plaquettes de silicium (wafers))' as FournisseurKind,
            name: data['Nom du fabricant \\n(Plaquettes de silicium (wafers))'],
          },
          {
            kind: 'Nom du fabricant \n(Polysilicium)' as FournisseurKind,
            name: data['Nom du fabricant \\n(Polysilicium)'],
          },
          {
            kind: 'Nom du fabricant \n(Postes de conversion)' as FournisseurKind,
            name: data['Nom du fabricant \\n(Postes de conversion)'],
          },
          {
            kind: 'Nom du fabricant \n(Structure)' as FournisseurKind,
            name: data['Nom du fabricant \\n(Structure)'],
          },
          {
            kind: 'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)' as FournisseurKind,
            name: data['Nom du fabricant \\n(Dispositifs de stockage de l’énergie *)'],
          },
          {
            kind: 'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)' as FournisseurKind,
            name: data['Nom du fabricant \\n(Dispositifs de suivi de la course du soleil *)'],
          },
          {
            kind: 'Nom du fabricant \n(Autres technologies)' as FournisseurKind,
            name: data['Nom du fabricant \\n(Autres technologies)'],
          },
        ].filter(({ name }) => name)

        await requestFournisseurModification({
          projectId: data.projectId,
          requestedBy: request.user,
          newFournisseurs,
          newEvaluationCarbone: data.evaluationCarbone,
          justification: data.justification,
          file,
        }).match(handleSuccess, handleError)
        break
      default:
        ;(
          await requestModification({
            ...data,
            file,
            user: request.user,
          })
        ).match({
          ok: handleSuccess,
          err: handleError,
        })
        break
    }
  })
)
