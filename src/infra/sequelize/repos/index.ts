import { eventStore } from '../../../config/eventStore.config'
import { fileStorageService } from '../../../config/fileStorage.config'
import { makeAppelOffre } from '../../../modules/appelOffre'
import { makeCandidateNotification } from '../../../modules/candidateNotification'
import { makeEventStoreRepo } from '../../../modules/eventStore'
import { makeEventStoreTransactionalRepo } from '../../../modules/eventStore/makeEventStoreTransactionalRepo'
import models from '../models'
import { makeFileRepo } from './fileRepo'
import { makeModificationRequestRepo } from './modificationRequestRepo'
import { NotificationRepo } from './notificationRepo'
import { makeProjectAdmissionKeyRepo } from './projectAdmissionKeyRepo'
import { makeProjectRepo } from './projectRepo'

export const fileRepo = makeFileRepo({ models, fileStorageService })
export const notificationRepo = new NotificationRepo(models)
export const candidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeCandidateNotification,
})
export const projectRepo = makeProjectRepo(eventStore)
export const modificationRequestRepo = makeModificationRequestRepo(eventStore)
export const appelOffreRepo = makeEventStoreRepo({
  eventStore,
  makeAggregate: makeAppelOffre,
})
export const projectAdmissionKeyRepo = makeProjectAdmissionKeyRepo(models)
