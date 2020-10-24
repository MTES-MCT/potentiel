import { ModificationRequest, User } from '../entities'
import { ModificationRequestRepo } from '../dataAccess'

interface MakeUseCaseProps {
  modificationRequestRepo: ModificationRequestRepo
}

interface CallUseCaseProps {
  userId: User['id']
}

export default function makeListUserRequests({ modificationRequestRepo }: MakeUseCaseProps) {
  return async function listUserRequests({
    userId,
  }: CallUseCaseProps): Promise<Array<ModificationRequest>> {
    return modificationRequestRepo.findAll({ userId }, true)
  }
}
