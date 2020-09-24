import { FileRepo } from './file'
import { NotificationRepo, makeGetFailedNotifications } from './notification'
import { makeGetUnnotifiedProjectsForPeriode } from './project'
import {
  onProjectCertificateGenerated,
  onProjectNotified,
  onProjectDCRDueDateSet,
  onProjectGFDueDateSet,
} from './project/projections'
import models from './models'
import { EventStore } from '../../modules/eventStore'

export const fileRepo = new FileRepo(models)
export const notificationRepo = new NotificationRepo(models)
export const getFailedNotifications = makeGetFailedNotifications(models)
export const getUnnotifiedProjectsForPeriode = makeGetUnnotifiedProjectsForPeriode(
  models
)

export const initProjections = (eventStore: EventStore) => {
  onProjectCertificateGenerated(eventStore, models)
  onProjectNotified(eventStore, models)
  onProjectDCRDueDateSet(eventStore, models)
  onProjectGFDueDateSet(eventStore, models)
}
