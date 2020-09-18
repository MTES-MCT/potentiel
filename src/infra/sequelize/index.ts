import { FileRepo } from './file'
import { NotificationRepo, makeGetFailedNotifications } from './notification'
import models from './models'

export const fileRepo = new FileRepo(models)
export const notificationRepo = new NotificationRepo(models)
export const getFailedNotifications = makeGetFailedNotifications(models)
