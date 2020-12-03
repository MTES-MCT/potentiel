import models from '../models'
import { makeGetUnnotifiedProjectsForPeriode } from './getUnnotifiedProjectsForPeriode'
import { makeGetModificationRequestDetails } from './getModificationRequestDetails'
import { makeGetFileProject } from './getFileProject'
import { makeGetFailedNotificationsForRetry } from './getFailedNotificationsForRetry'
import { makeGetFailedNotificationDetails } from './getFailedNotificationDetails'

export const getUnnotifiedProjectsForPeriode = makeGetUnnotifiedProjectsForPeriode(models)
export const getModificationRequestDetails = makeGetModificationRequestDetails(models)
export const getFileProject = makeGetFileProject(models)
export { getStats } from './getStats'
export const getFailedNotificationsForRetry = makeGetFailedNotificationsForRetry(models)
export const getFailedNotificationDetails = makeGetFailedNotificationDetails(models)
