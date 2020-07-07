import { requestModification, shouldUserAccessProject } from '../useCases'
import { Redirect, SystemError } from '../helpers/responses'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import _ from 'lodash'
import moment from 'moment'

import fs from 'fs'
import util from 'util'
import path from 'path'
const moveFile = util.promisify(fs.rename)
const dirExists = util.promisify(fs.exists)
const makeDir = util.promisify(fs.mkdir)
const makeDirIfNecessary = async (dirpath) => {
  const exists = await dirExists(dirpath)
  if (!exists) await makeDir(dirpath)

  return dirpath
}
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
  // console.log(
  //   'Call to postRequestModification received',
  //   request.body,
  //   request.file
  // )

  // console.log(
  //   'Call to postRequestModification received',
  //   request.body,
  //   request.file
  // )

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
    data.evaluationCarbone =
      data.evaluationCarbone && Number(data.evaluationCarbone)
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
      if (!delayedServiceDate.isValid()) throw 'invalid date format'
      data.delayedServiceDate = delayedServiceDate.toDate().getTime()
    }
  } catch (error) {
    console.log('Could not convert delayedServiceDate to date')
    const { projectId, type } = data
    return Redirect(returnRoute(type, projectId), {
      error: "Erreur: la date envoyée n'est pas au bon format (JJ/MM/AAAA)",
    })
  }

  // If there is a file, move it to a proper location

  const { filename, filepath } = request.file
    ? makeProjectFilePath(data.projectId, request.file.originalname)
    : { filename: undefined, filepath: undefined }
  if (request.file && filepath) {
    try {
      await makeDirIfNecessary(path.dirname(filepath))
      await moveFile(request.file.path, filepath)
      // console.log('File moved to ', filepath)
    } catch (error) {
      console.log('Could not move file')
    }
  }

  const result = await requestModification({
    ...data,
    filename,
    user: request.user,
  })

  if (result.is_err() && filepath) {
    console.log('requestModification failed, removing file')
    await deleteFile(filepath)
  }

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
