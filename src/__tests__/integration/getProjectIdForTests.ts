import { projectRepo } from '../../dataAccess'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'

const getProjectIdForTests = async (request: HttpRequest) => {
  const { nomProjet } = request.query

  if (!nomProjet) {
    console.log('getProjectIdForTests missing nomProjet')
    return SystemError('missing nomProjet')
  }

  const [project] = (await projectRepo.findAll({ nomProjet })).items
  if (!project) {
    return SystemError('No project with this nomProjet')
  }

  return Success(project.id)
}

export { getProjectIdForTests }
