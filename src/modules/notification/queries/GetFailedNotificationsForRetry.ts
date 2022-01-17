import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '../../shared'
import { Notification } from '../Notification'

export interface FailedNotification {
  id: Notification['id']
  isObsolete: boolean
}

export type GetFailedNotificationsForRetry = () => ResultAsync<
  FailedNotification[],
  InfraNotAvailableError
>
