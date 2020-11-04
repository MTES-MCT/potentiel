import { DataTypes, Op } from 'sequelize'
import { PasswordRetrievalRepo } from '../'
import { PasswordRetrieval, makePasswordRetrieval } from '../../entities'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => item
const serialize = (item) => item

export default function makePasswordRetrievalRepo({ sequelize }): PasswordRetrievalRepo {
  const PasswordRetrievalModel = sequelize.define('passwordRetrieval', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    insert,
    remove,
    countSince,
  })

  async function findById(id: PasswordRetrieval['id']): OptionAsync<PasswordRetrieval> {
    await _isDbReady

    try {
      const passwordRetrievalInDb = await PasswordRetrievalModel.findByPk(id, {
        raw: true,
      })

      if (!passwordRetrievalInDb) return None

      const passwordRetrievalInstance = makePasswordRetrieval(deserialize(passwordRetrievalInDb))

      if (passwordRetrievalInstance.is_err()) throw passwordRetrievalInstance.unwrap_err()

      return Some(passwordRetrievalInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('PasswordRetrieval.findById error', error)
      return None
    }
  }

  async function insert(passwordRetrieval: PasswordRetrieval): ResultAsync<PasswordRetrieval> {
    await _isDbReady

    try {
      await PasswordRetrievalModel.create(serialize(passwordRetrieval))
      return Ok(passwordRetrieval)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('PasswordRetrieval.insert error', error)
      return Err(error)
    }
  }

  async function remove(id: PasswordRetrieval['id']): ResultAsync<null> {
    await _isDbReady

    try {
      await PasswordRetrievalModel.destroy({
        where: { id },
      })
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('PasswordRetrieval.remove error', error)
      return Err(error)
    }
  }

  async function countSince(email: string, since: number): Promise<number> {
    await _isDbReady

    try {
      return await PasswordRetrievalModel.count({
        where: { email, createdOn: { [Op.gte]: since } },
      })
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('PasswordRetrieval.countSince error', error)
      return 0
    }
  }
}

export { makePasswordRetrievalRepo }
