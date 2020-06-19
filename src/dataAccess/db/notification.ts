import { DataTypes } from 'sequelize'
import { NotificationRepo } from '../'
import { Notification, makeNotification } from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { paginate, makePaginatedList } from '../../helpers/paginate'
import {
  Err,
  None,
  Ok,
  OptionAsync,
  ResultAsync,
  Some,
  Pagination,
  PaginatedList,
} from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  error: item.error || undefined,
  createdAt: item.createdAt.getTime(),
})
const serialize = (item) => item

export default function makeNotificationRepo({ sequelize }): NotificationRepo {
  const NotificationModel = sequelize.define('notification', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    context: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    variables: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    error: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findAll,
    save,
  })

  async function findAll(
    query?: Record<string, any>
  ): Promise<Array<Notification>>
  async function findAll(
    query: Record<string, any>,
    pagination: Pagination
  ): Promise<PaginatedList<Notification>>
  async function findAll(
    query?: Record<string, any>,
    pagination?: Pagination
  ): Promise<PaginatedList<Notification> | Array<Notification>> {
    await _isDbReady

    try {
      const opts: any = {}
      if (query) {
        opts.where = query
      }

      opts.order = [['createdAt', 'DESC']]

      if (pagination) {
        const { count, rows } = await NotificationModel.findAndCountAll({
          ...opts,
          ...paginate(pagination),
        })

        const deserializedItems = mapExceptError(
          rows.map((item) => item.get()),
          deserialize,
          'Notification.findAll.deserialize error'
        )

        return makePaginatedList(deserializedItems, pagination, count)
      }

      // No pagination
      const notificationsRaw = await NotificationModel.findAll(opts)

      return mapExceptError(
        notificationsRaw.map((item) => item.get()),
        deserialize,
        'Notification.findAll.deserialize error'
      )
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Notification.findAll error', error)
      return pagination ? makePaginatedList([], pagination, 0) : []
    }
  }

  async function save(notification: Notification): ResultAsync<void> {
    await _isDbReady

    try {
      await NotificationModel.create(serialize(notification))
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Notification.insert error', error)
      return Err(error)
    }
  }
}

export { makeNotificationRepo }
