import { FileRepo } from './fileRepo'
import { NotificationRepo } from './notificationRepo'
import models from '../models'

export const fileRepo = new FileRepo(models)
export const notificationRepo = new NotificationRepo(models)
