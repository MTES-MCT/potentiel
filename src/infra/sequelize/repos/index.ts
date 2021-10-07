import { eventStore } from '../../../config/eventStore.config'
import { fileStorageService } from '../../../config/fileStorage.config'
import { makeAppelOffre } from '../../../modules/appelOffre'
import { makeCandidateNotification } from '../../../modules/candidateNotification'
import { makeEventStoreRepo } from '../../../modules/eventStore'
import { makeEventStoreTransactionalRepo } from '../../../modules/eventStore/makeEventStoreTransactionalRepo'
import { makeUser } from '../../../modules/users'
import models from '../models'
import { makeFileRepo } from './fileRepo'
import { makeModificationRequestRepo } from './modificationRequestRepo'
import { NotificationRepo } from './notificationRepo'
import { makeProjectRepo } from './projectRepo'
import { makeProjectClaimRepo } from './projectClaimRepo'

export const fileRepo = makeFileRepo({ models, fileStorageService })
export const notificationRepo = new NotificationRepo(models)
export const candidateNotificationRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeCandidateNotification,
})
export const projectRepo = makeProjectRepo(eventStore)
export const projectClaimRepo = makeProjectClaimRepo(eventStore)
export const modificationRequestRepo = makeModificationRequestRepo(eventStore)
export const appelOffreRepo = makeEventStoreRepo({
  eventStore,
  makeAggregate: makeAppelOffre,
})
export const userRepo = makeEventStoreTransactionalRepo({
  eventStore,
  makeAggregate: makeUser,
})
