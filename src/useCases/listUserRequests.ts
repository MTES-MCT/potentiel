import { ModificationRequest, makeModificationRequest, User } from '../entities'
import { ModificationRequestRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  modificationRequestRepo: ModificationRequestRepo
}

interface CallUseCaseProps {
  userId: User['id']
}

export default function makeListUserRequests({
  modificationRequestRepo
}: MakeUseCaseProps) {
  return async function listUserRequests({
    userId
  }: CallUseCaseProps): Promise<Array<ModificationRequest>> {
    return await modificationRequestRepo.findAll({ userId }, true)
  }
}
