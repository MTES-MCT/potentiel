import { User, Project } from '../../entities'
import { UserRepo, ProjectRepo } from '../../dataAccess'
import _ from 'lodash'

interface CheckProps {
  projectId: Project['id']
  user: User
}

export class ShouldUserAccessProject {
  constructor(
    private userRepo: UserRepo,
    private findProjectById: ProjectRepo['findById']
  ) {}

  async check({ projectId, user }: CheckProps): Promise<boolean> {
    if (['admin', 'dgec'].includes(user.role)) return true

    if (user.role === 'dreal') {
      const userDreals = await this.userRepo.findDrealsForUser(user.id)
      const project = await this.findProjectById(projectId)

      if (!project) return false

      return userDreals.some((region) => project.regionProjet.includes(region))
    }

    return this.userRepo.hasProject(user.id, projectId)
  }
}
