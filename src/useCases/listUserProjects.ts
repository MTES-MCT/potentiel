import { User, Project } from '../entities'
import { UserRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  userRepo: UserRepo
}

interface CallUseCaseProps {
  userId: User['id']
}

export default function makeListUserProjects({ userRepo }: MakeUseCaseProps) {
  return async function listUserProjects({
    userId
  }: CallUseCaseProps): Promise<Array<Project>> {
    return userRepo.findProjects(userId)
  }
}
