import models from '../../../models'
import { makeGetFailedNotificationsForRetry } from './getFailedNotificationsForRetry'
import { makeGetFailedNotificationDetails } from './getFailedNotificationDetails'

export const getFailedNotificationsForRetry = makeGetFailedNotificationsForRetry(models)
export const getFailedNotificationDetails = makeGetFailedNotificationDetails(models)
