import { ResultAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'
import { Notification } from '../Notification'

export type GetFailedNotifications = () => ResultAsync<
  Notification['id'][],
  InfraNotAvailableError
>
