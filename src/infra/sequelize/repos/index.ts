import { makeFileRepo } from './fileRepo'
import { NotificationRepo } from './notificationRepo'
import models from '../models'
import { eventStore } from '../../../config/eventStore.config'
import { fileStorageService } from '../../../config/fileStorage.config'
import { makeEventStoreTransactionalRepo } from '../../../modules/eventStore/makeEventStoreTransactionalRepo'
import { makeCandidateNotification } from '../../../modules/candidateNotification'
import { makeProjectRepo } from './projectRepo'
import { makeEventStoreRepo } from '../../../modules/eventStore'
import { makeModificationRequest } from '../../../modules/modificationRequest'

export const fileRepo = makeFileRepo({ models, fileStorageService })
export const notificationRepo = new NotificationRepo(models)
export const candidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeCandidateNotification,
})
export const projectRepo = makeProjectRepo(eventStore)
export const modificationRequestRepo = makeEventStoreRepo({
  eventStore,
  makeAggregate: ({ id, events }) =>
    makeModificationRequest({ history: events, modificationRequestId: id }),
})
