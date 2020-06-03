import { DataTypes } from 'sequelize'
import { NotificationRepo } from '../'
import { Notification, makeNotification } from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => item
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
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findAll,
    save,
  })

  async function findAll(): Promise<Array<Notification>> {
    await _isDbReady

    try {
      const notificationsRaw = await NotificationModel.findAll({ raw: true })

      const deserializedItems = mapExceptError(
        notificationsRaw,
        deserialize,
        'Notification.findAll.deserialize error'
      )

      return deserializedItems.map(makeNotification)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Notification.findAll error', error)
      return []
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
