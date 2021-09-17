import { logger } from '../../../core/utils'
import { UserRepo } from '../../../dataAccess'
import { ProjectImported, ProjectReimported } from '../../project'

export const handleProjectImported =
  (deps: { addProjectToUserWithEmail: UserRepo['addProjectToUserWithEmail'] }) =>
  async (event: ProjectImported | ProjectReimported) => {
    const { projectId, data } = event.payload
    const { email } = data
    try {
      if (email && email.length) {
        await deps.addProjectToUserWithEmail(projectId, email)
      }
    } catch (error) {
      logger.error(error)
    }
  }
