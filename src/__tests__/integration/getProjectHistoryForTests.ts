import { projectRepo } from '../../dataAccess'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'

const getProjectHistoryForTests = async (request: HttpRequest) => {
  const { nomProjet } = request.query

  if (!nomProjet) {
    console.log('getProjectHistoryForTests missing nomProjet')
    return SystemError('missing nomProjet')
  }

  const project = await projectRepo.findOne({ nomProjet })
  if (!project) {
    return SystemError('No project with this nomProjet')
  }

  const projectWithHistory = await projectRepo.findById(project.id, true)
  if (!projectWithHistory) {
    return SystemError('No project history with this nomProjet')
  }

  return Success({ project: projectWithHistory })
}

export { getProjectHistoryForTests }
