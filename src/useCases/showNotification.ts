import { CandidateNotification, makeCandidateNotification } from '../entities'
import { CandidateNotificationRepo } from '../dataAccess'
import _ from 'lodash'

interface MakeUseCaseProps {
  candidateNotificationRepo: CandidateNotificationRepo
}

interface CallUseCaseProps {
  id: string
}

export default function makeShowNotification({
  candidateNotificationRepo
}: MakeUseCaseProps) {
  return async function showNotification({
    id
  }: CallUseCaseProps): Promise<CandidateNotification | null> {
    return await candidateNotificationRepo.findById({ id })
  }
}
