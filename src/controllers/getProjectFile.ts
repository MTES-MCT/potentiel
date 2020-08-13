import { makeProjectFilePath } from '../helpers/makeProjectFilePath'
import { NotFoundError, SuccessFile } from '../helpers/responses'
import { HttpRequest } from '../types'
import { shouldUserAccessProject } from '../useCases'

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
