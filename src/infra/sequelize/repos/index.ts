import { FileRepo } from './fileRepo'
import { NotificationRepo } from './notificationRepo'
import models from '../models'
import { eventStore } from '../../../config/eventStore.config'
import { EventStoreTransactionalRepo } from '../../../modules/eventStore/EventStoreTransactionalRepo'
import {
  makeCandidateNotification,
  CandidateNotification,
} from '../../../modules/candidateNotification'

export const fileRepo = new FileRepo(models)
export const notificationRepo = new NotificationRepo(models)
export const candidateNotificationRepo = new EventStoreTransactionalRepo<CandidateNotification>(
  eventStore,
  makeCandidateNotification
)
