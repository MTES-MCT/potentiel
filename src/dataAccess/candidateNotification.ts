import { CandidateNotification } from '../entities'

export type CandidateNotificationRepo = {
  findById: ({ id: string }) => Promise<CandidateNotification | null>
  findAll: (
    query?: Record<string, any>
  ) => Promise<Array<CandidateNotification>>
  insertMany: (
    candidateNotifications: Array<CandidateNotification>
  ) => Promise<void>
}
