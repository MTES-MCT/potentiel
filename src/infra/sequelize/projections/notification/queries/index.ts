import models from '../../../models'
import { makeGetFailedNotifications } from './getFailedNotifications'

export const getFailedNotifications = makeGetFailedNotifications(models)
