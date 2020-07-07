import { Notification } from '../entities'
import { ResultAsync, PaginatedList, Pagination } from '../types'
import { Required } from 'utility-types'

export type NotificationRepo = {
  save: (notification: Notification) => ResultAsync<null>
  findAll(query?: Record<string, any>): Promise<Array<Notification>>
  findAll(
    query: Record<string, any>,
    pagination: Pagination
  ): Promise<PaginatedList<Notification>>
}
