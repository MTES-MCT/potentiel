import { requestModification, shouldUserAccessProject } from '../useCases'
import { Redirect, SystemError } from '../helpers/responses'
import { HttpRequest } from '../types'
import ROUTES from '../routes'
import _ from 'lodash'
import moment from 'moment'

import fs from 'fs'
import util from 'util'
import { pathExists } from '../core/utils'

const deleteFile = util.promisify(fs.unlink)

const returnRoute = (type, projectId) => {
  let returnRoute: string
  switch (type) {
    case 'delai':
      returnRoute = ROUTES.DEMANDE_DELAIS(projectId)
      break
    case 'fournisseur':
      returnRoute = ROUTES.CHANGER_FOURNISSEUR(projectId)
      break
    case 'actionnaire':
      returnRoute = ROUTES.CHANGER_ACTIONNAIRE(projectId)
      break
    case 'puissance':
      returnRoute = ROUTES.CHANGER_PUISSANCE(projectId)
      break
    case 'producteur':
      returnRoute = ROUTES.CHANGER_PRODUCTEUR(projectId)
      break
    case 'abandon':
      returnRoute = ROUTES.DEMANDER_ABANDON(projectId)
      break
    case 'recours':
      returnRoute = ROUTES.DEPOSER_RECOURS(projectId)
      break
    default:
      returnRoute = ROUTES.USER_LIST_PROJECTS
      break
  }
  return returnRoute
}

const postRequestModification = async (request: HttpRequest) => {
  if (!request.user) {
    return SystemError('User must be logged in')
  }

  const userAccess = await shouldUserAccessProject({
    projectId: request.body.projectId,
    user: request.user,
  })

  if (!userAccess) {
    return Redirect(ROUTES.USER_DASHBOARD)
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
    console.log('Could not convert puissance to Number')
    const { projectId, type } = data
    return Redirect(returnRoute(type, projectId), {
      error: 'Erreur: la puissance doit être un nombre',
    })
  }

  // Convert evaluationCarbone
  try {
    data.evaluationCarbone = data.evaluationCarbone && Number(data.evaluationCarbone)
  } catch (error) {
    console.log('Could not convert evaluationCarbone to Number')
    const { projectId, type } = data
    return Redirect(returnRoute(type, projectId), {
      error: "Erreur: l'evaluationCarbone doit être un nombre",
    })
  }

  // Convert delayedServiceDate
  try {
    if (data.delayedServiceDate) {
      const delayedServiceDate = moment(data.delayedServiceDate, 'DD/MM/YYYY')
      if (!delayedServiceDate.isValid()) throw new Error('invalid date format')
      data.delayedServiceDate = delayedServiceDate.toDate().getTime()
    }
  } catch (error) {
    console.log('Could not convert delayedServiceDate to date')
    const { projectId, type } = data
    return Redirect(returnRoute(type, projectId), {
      error: "Erreur: la date envoyée n'est pas au bon format (JJ/MM/AAAA)",
    })
  }

  let file

  if (request.file) {
    const dirExists: boolean = await pathExists(request.file.path)

    if (!dirExists) {
      const { projectId, type } = data
      return Redirect(returnRoute(type, projectId), {
        error: "Erreur: la pièce-jointe n'a pas pu être intégrée. Merci de réessayer.",
      })
    }

    file = {
      contents: fs.createReadStream(request.file.path),
      filename: `${Date.now()}-${request.file.originalname}`,
    }
  }

  const result = await requestModification({
    ...data,
    file,
    user: request.user,
  })

  if (request.file) await deleteFile(request.file.path)

  return result.match({
    ok: () =>
      Redirect(ROUTES.USER_LIST_DEMANDES, {
        success: 'Votre demande a bien été prise en compte.',
      }),
    err: (e: Error) => {
      console.log('postRequestModification error', e)
      const { projectId, type } = data
      const redirectRoute = returnRoute(type, projectId)
      console.log('redirecting to ', redirectRoute)
      return Redirect(redirectRoute, {
        ..._.omit(data, 'projectId'),
        error: "Votre demande n'a pas pu être prise en compte: " + e.message,
      })
    },
  })
}

export { postRequestModification }
