import { FileRepo } from './file'
import { NotificationRepo, makeGetFailedNotifications } from './notification'
import { makeGetUnnotifiedProjectsForPeriode } from './project'
import { initProjectProjections } from './project/projections'
import models from './models'
import { EventStore } from '../../modules/eventStore'
import { SequelizeEventStore } from './eventStore'

export const fileRepo = new FileRepo(models)
export const notificationRepo = new NotificationRepo(models)
export const getFailedNotifications = makeGetFailedNotifications(models)
export const getUnnotifiedProjectsForPeriode = makeGetUnnotifiedProjectsForPeriode(
  models
)
export const sequelizeEventStore = new SequelizeEventStore(models)

export const initProjections = (eventStore: EventStore) => {
  initProjectProjections(eventStore, models)
}
