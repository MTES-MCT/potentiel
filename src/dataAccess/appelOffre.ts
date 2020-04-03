import { AppelOffre } from '../entities'
import { ResultAsync, OptionAsync } from '../types'

export type CandidateNotificationRepo = {
  findAll: () => Promise<Array<AppelOffre>>
}
