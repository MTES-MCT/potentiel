import { CandidateNotification } from '../entities'
import { ResultAsync, OptionAsync } from '../types'

export type CandidateNotificationRepo = {
  findById: (
    id: CandidateNotification['id']
  ) => OptionAsync<CandidateNotification>
  findAll: (
    query?: Record<string, any>
  ) => Promise<Array<CandidateNotification>>
  insert: (
    candidateNotification: CandidateNotification
  ) => ResultAsync<CandidateNotification>
  update: (
    candidateNotification: CandidateNotification
  ) => ResultAsync<CandidateNotification>
}
