import models from '../models'
import { makeGetUnnotifiedProjectsForPeriode } from './getUnnotifiedProjectsForPeriode'
import { makeGetModificationRequestDetails } from './getModificationRequestDetails'
import { makeGetModificationRequestStatus } from './getModificationRequestStatus'
import { makeGetModificationRequestUpdateInfo } from './getModificationRequestInfoForStatusNotification'
import { makeGetFileProject } from './getFileProject'
import { makeGetFailedNotificationsForRetry } from './getFailedNotificationsForRetry'
import { makeGetFailedNotificationDetails } from './getFailedNotificationDetails'
import { makeGetModificationRequestListForUser } from './getModificationRequestListForUser'

export const getUnnotifiedProjectsForPeriode = makeGetUnnotifiedProjectsForPeriode(models)
export const getModificationRequestDetails = makeGetModificationRequestDetails(models)
export const getModificationRequestStatus = makeGetModificationRequestStatus(models)
export const getModificationRequestInfoForStatusNotification = makeGetModificationRequestUpdateInfo(
  models
)
export const getModificationRequestListForUser = makeGetModificationRequestListForUser(models)

export const getFileProject = makeGetFileProject(models)
export { getStats } from './getStats'
export const getFailedNotificationsForRetry = makeGetFailedNotificationsForRetry(models)
export const getFailedNotificationDetails = makeGetFailedNotificationDetails(models)
