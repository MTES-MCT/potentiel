import { Notification } from '../entities'
import { ResultAsync } from '../types'
import { Required } from 'utility-types'

export type NotificationRepo = {
  save: (notification: Notification) => ResultAsync<void>
  findAll: () => Promise<Array<Notification>>
}
