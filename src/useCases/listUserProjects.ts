import { User, Project } from '../entities'
import { UserRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  userRepo: UserRepo
}

interface CallUseCaseProps {
  user: User
}

export default function makeListUserProjects({ userRepo }: MakeUseCaseProps) {
  return async function listUserProjects({
    user
  }: CallUseCaseProps): Promise<Array<Project>> {
    return userRepo.findProjects(user)
  }
}
