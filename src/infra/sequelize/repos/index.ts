import { FileRepo } from './fileRepo'
import { NotificationRepo } from './notificationRepo'
import models from '../models'
import { eventStore } from '../../../config/eventStore.config'
import { makeEventStoreTransactionalRepo } from '../../../modules/eventStore/makeEventStoreTransactionalRepo'
import { makeCandidateNotification } from '../../../modules/candidateNotification'
import { makeProjectRepo } from './projectRepo'

export const fileRepo = new FileRepo(models)
export const notificationRepo = new NotificationRepo(models)
export const candidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeCandidateNotification,
})
export const projectRepo = makeProjectRepo(eventStore)
