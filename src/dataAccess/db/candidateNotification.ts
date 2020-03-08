import { DataTypes } from 'sequelize'

import isDbReady from './helpers/isDbReady'

import { CandidateNotificationRepo } from '../'
import {
  makeCandidateNotification,
  CandidateNotification
} from '../../entities'

const deserializeDataField = item =>
  item.data ? { ...item, data: JSON.parse(item.data) } : item

const serializeDataField = item =>
  item.data ? { ...item, data: JSON.stringify(item.data) } : item

export default function makeCandidateNotificationRepo({
  sequelize
}): CandidateNotificationRepo {
  const CandidateNotificationModel = sequelize.define('candidateNotification', {
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
    insertMany,
    update
  })

  async function findById({ id }): Promise<CandidateNotification | null> {
    await _isDbReady

    const candidateNotificationInDb = await CandidateNotificationModel.findByPk(
      id,
      { raw: true }
    )

    return (
      candidateNotificationInDb &&
      makeCandidateNotification(deserializeDataField(candidateNotificationInDb))
    )
  }

  async function findAll(query?): Promise<Array<CandidateNotification>> {
    await _isDbReady

    return (
      await CandidateNotificationModel.findAll(
        query
          ? {
              where: query
            }
          : {}
      )
    )
      .map(deserializeDataField)
      .map(makeCandidateNotification)
  }

  async function insertMany(
    candidateNotifications: Array<CandidateNotification>
  ) {
    await _isDbReady

    await Promise.all(
      candidateNotifications
        .map(serializeDataField)
        .map(candidateNotification =>
          CandidateNotificationModel.create(candidateNotification)
        )
    )
  }

  async function update(candidateNotification: CandidateNotification) {
    await _isDbReady

    if (!candidateNotification.id) {
      throw new Error('Cannot update candidateNotification that has no id')
    }

    await CandidateNotificationModel.update(
      serializeDataField(candidateNotification),
      {
        where: { id: candidateNotification.id }
      }
    )
  }
}

export { makeCandidateNotificationRepo }
