import { DataTypes } from 'sequelize'
import { CredentialsRepo } from '../'
import { Credentials, makeCredentials } from '../../entities'
import {
  Err,
  None,
  Ok,
  OptionAsync,
  ResultAsync,
  Some,
  ErrorResult,
} from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => item
const serialize = (item) => item

export default function makeCredentialsRepo({ sequelize }): CredentialsRepo {
  const CredentialsModel = sequelize.define('credentials', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findByEmail,
    insert,
    update,
  })

  async function findByEmail(
    _email: Credentials['email']
  ): OptionAsync<Credentials> {
    await _isDbReady

    try {
      const credentialsInDb = await CredentialsModel.findOne({
        where: { email: _email },
      })

      if (!credentialsInDb) return None

      return Some(credentialsInDb.get())
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Credentials.findByEmail error', error)
      return None
    }
  }

  async function insert(credentials: Credentials): ResultAsync<Credentials> {
    await _isDbReady

    try {
      await CredentialsModel.create(serialize(credentials))
      return Ok(credentials)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Credentials.insert error', error)
      return Err(error)
    }
  }

  async function update(
    id: Credentials['id'],
    hash: Credentials['hash']
  ): ResultAsync<Credentials> {
    await _isDbReady

    if (!hash || !hash.length) {
      return ErrorResult('Credentials.update : Missing hash argument')
    }

    try {
      const [updatedRows] = await CredentialsModel.update(
        { hash },
        {
          where: { id },
        }
      )

      if (updatedRows === 0) {
        return ErrorResult('Credentials introuvables')
      }

      const credentials = await CredentialsModel.findByPk(id, { raw: true })
      return Ok(credentials)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Credentials.update error', error)
      return Err(error)
    }
  }
}

export { makeCredentialsRepo }
