import { BaseShouldUserAccessProject } from '../modules/authorization'
import { userRepo, projectRepo } from './repos.config'

export const shouldUserAccessProject = new BaseShouldUserAccessProject(
  userRepo,
  projectRepo.findById
)
