import fs from 'fs'
import _ from 'lodash'
import moment from 'moment'
import { logger, pathExists } from '../core/utils'
import { addQueryParams } from '../helpers/addQueryParams'
import routes from '../routes'
import { requestModification, shouldUserAccessProject } from '../useCases'
import { ensureLoggedIn, ensureRole } from './authentication'
import { upload } from './upload'
import { v1Router } from './v1Router'

const returnRoute = (type, projectId) => {
  let returnRoute: string
  switch (type) {
    case 'delai':
      returnRoute = routes.DEMANDE_DELAIS(projectId)
      break
    case 'fournisseur':
      returnRoute = routes.CHANGER_FOURNISSEUR(projectId)
      break
    case 'actionnaire':
      returnRoute = routes.CHANGER_ACTIONNAIRE(projectId)
      break
    case 'puissance':
      returnRoute = routes.CHANGER_PUISSANCE(projectId)
      break
    case 'producteur':
      returnRoute = routes.CHANGER_PRODUCTEUR(projectId)
      break
    case 'abandon':
      returnRoute = routes.DEMANDER_ABANDON(projectId)
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
  ensureLoggedIn(),
  ensureRole('porteur-projet'),
  upload.single('file'),
  async (request, response) => {
    if (!request.user) {
      return response.status(500).send('User must be logged in')
    }

    const userAccess = await shouldUserAccessProject({
      projectId: request.body.projectId,
      user: request.user,
    })

    if (!userAccess) {
      return response.redirect(routes.USER_DASHBOARD)
    }

    const data = _.pick(request.body, [
      'type',
      'actionnaire',
      'producteur',
      'fournisseur',
      'puissance',
      'justification',
      'projectId',
      'evaluationCarbone',
      'delayedServiceDate',
    ])

    // Convert puissance
    try {
      data.puissance = data.puissance && Number(data.puissance)
    } catch (error) {
      logger.info('Could not convert puissance to Number')
      const { projectId, type } = data
      return response.redirect(
        addQueryParams(returnRoute(type, projectId), {
          error: 'Erreur: la puissance doit être un nombre',
        })
      )
    }

    // Convert evaluationCarbone
    try {
      data.evaluationCarbone = data.evaluationCarbone && Number(data.evaluationCarbone)
    } catch (error) {
      logger.info('Could not convert evaluationCarbone to Number')
      const { projectId, type } = data
      return response.redirect(
        addQueryParams(returnRoute(type, projectId), {
          error: "Erreur: l'evaluationCarbone doit être un nombre",
        })
      )
    }

    // Convert delayedServiceDate
    try {
      if (data.delayedServiceDate) {
        const delayedServiceDate = moment(data.delayedServiceDate, 'DD/MM/YYYY')
        if (!delayedServiceDate.isValid()) throw new Error('invalid date format')
        data.delayedServiceDate = delayedServiceDate.toDate().getTime()
      }
    } catch (error) {
      logger.info('Could not convert delayedServiceDate to date')
      const { projectId, type } = data
      return response.redirect(
        addQueryParams(returnRoute(type, projectId), {
          error: "Erreur: la date envoyée n'est pas au bon format (JJ/MM/AAAA)",
        })
      )
    }

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

    ;(
      await requestModification({
        ...data,
        file,
        user: request.user,
      })
    ).match({
      ok: () =>
        response.redirect(
          addQueryParams(routes.USER_LIST_REQUESTS, {
            success: 'Votre demande a bien été prise en compte.',
          })
        ),
      err: (e: Error) => {
        logger.error(e)
        const { projectId, type } = data
        const redirectRoute = returnRoute(type, projectId)
        return response.redirect(
          addQueryParams(redirectRoute, {
            ..._.omit(data, 'projectId'),
            error: "Votre demande n'a pas pu être prise en compte. Merci de réessayer.",
          })
        )
      },
    })
  }
)
