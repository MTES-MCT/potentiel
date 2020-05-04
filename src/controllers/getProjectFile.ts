import {
  Redirect,
  Success,
  SuccessFile,
  SystemError,
  NotFoundError,
} from '../helpers/responses'
import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { projectRepo, appelsOffreStatic } from '../dataAccess'
import { Controller, HttpRequest } from '../types'
import ROUTES from '../routes'
import { shouldUserAccessProject } from '../useCases'

import { makeCertificate } from '../views/pages/candidateCertificate'

const getProjectFile = async (request: HttpRequest) => {
  // console.log('Call to getProjectFile received', request.query, request.file)

  try {
    const { projectId, filename } = request.params

    if (!request.user) {
      return NotFoundError('Fichier introuvable.')
    }

    // Check user rights on this project
    const userAccess = await shouldUserAccessProject({
      projectId,
      user: request.user,
    })

    if (!userAccess) {
      return NotFoundError('Fichier introuvable.')
    }

    const { filepath } = makeProjectFilePath(projectId, filename, true)

    return SuccessFile(filepath)
  } catch (error) {
    console.log('getProjectFile error', error)
    return NotFoundError('Fichier introuvable.')
  }
}

export { getProjectFile }
