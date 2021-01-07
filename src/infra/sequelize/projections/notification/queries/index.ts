import models from '../../../models'
import { makeGetFailedNotifications } from './getFailedNotifications'
import { makeGetFailedNotificationDetails } from './getFailedNotificationDetails'

export const getFailedNotifications = makeGetFailedNotifications(models)
export const getFailedNotificationDetails = makeGetFailedNotificationDetails(models)
