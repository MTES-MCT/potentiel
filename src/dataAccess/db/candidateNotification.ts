import { DataTypes } from 'sequelize'
import { CandidateNotificationRepo } from '../'
import {
  CandidateNotification,
  makeCandidateNotification
} from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

const deserialize = item =>
  item.data ? { ...item, data: JSON.parse(item.data) } : item

const serialize = item =>
  item.data ? { ...item, data: JSON.stringify(item.data) } : item

export default function makeCandidateNotificationRepo({
  sequelize
}): CandidateNotificationRepo {
  const CandidateNotificationModel = sequelize.define('candidateNotification', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    template: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.STRING,
      allowNull: true
    },
    projectAdmissionKey: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    insert,
    update
  })

  async function findById(
    id: CandidateNotification['id']
  ): OptionAsync<CandidateNotification> {
    await _isDbReady

    try {
      const candidateNotificationInDb = await CandidateNotificationModel.findByPk(
        id,
        { raw: true }
      )

      if (!candidateNotificationInDb) return None

      const candidateNotificationInstance = makeCandidateNotification(
        deserialize(candidateNotificationInDb)
      )

      if (candidateNotificationInstance.is_err())
        throw candidateNotificationInstance.unwrap_err()

      return Some(candidateNotificationInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('CandidateNotification.findById error', error)
      return None
    }
  }

  async function findAll(
    query?: Record<string, any>
  ): Promise<Array<CandidateNotification>> {
    await _isDbReady

    try {
      const candidateNotificationsRaw = await CandidateNotificationModel.findAll(
        query
          ? {
              where: query
            }
          : {},
        { raw: true }
      )

      const deserializedItems = mapExceptError(
        candidateNotificationsRaw,
        deserialize,
        'CandidateNotification.findAll.deserialize error'
      )

      return mapIfOk(
        deserializedItems,
        makeCandidateNotification,
        'CandidateNotification.findAll.makeCandidateNotification error'
      )
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('CandidateNotification.findAll error', error)
      return []
    }
  }

  async function insert(
    candidateNotification: CandidateNotification
  ): ResultAsync<CandidateNotification> {
    await _isDbReady

    try {
      await CandidateNotificationModel.create(serialize(candidateNotification))
      return Ok(candidateNotification)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('CandidateNotification.insert error', error)
      return Err(error)
    }
  }

  async function update(
    candidateNotification: CandidateNotification
  ): ResultAsync<CandidateNotification> {
    await _isDbReady

    try {
      await CandidateNotificationModel.update(
        serialize(candidateNotification),
        {
          where: { id: candidateNotification.id }
        }
      )
      return Ok(candidateNotification)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('CandidateNotification.findAll error', error)
      return Err(error)
    }
  }
}

export { makeCandidateNotificationRepo }
