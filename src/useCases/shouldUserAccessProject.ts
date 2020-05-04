import { User, Project, makeUser } from '../entities'
import { UserRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  userRepo: UserRepo
}

interface CallUseCaseProps {
  projectId: Project['id']
  user: User
}

export default function makeShouldUserAccessProject({
  userRepo,
}: MakeUseCaseProps) {
  return async function shouldUserAccessProject({
    projectId,
    user,
  }: CallUseCaseProps): Promise<boolean> {
    if (['admin', 'dgec'].includes(user.role)) return true

    return userRepo.hasProject(user.id, projectId)
  }
}
