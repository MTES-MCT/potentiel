import { DataTypes } from 'sequelize'
import { CredentialsRepo } from '../'
import { Credentials, makeCredentials } from '../../entities'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = item => item
const serialize = item => item

export default function makeCredentialsRepo({ sequelize }): CredentialsRepo {
  const CredentialsModel = sequelize.define('credentials', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findByEmail,
    insert,
    update
  })

  async function findByEmail(
    _email: Credentials['email']
  ): OptionAsync<Credentials> {
    await _isDbReady

    try {
      const credentialsInDb = await CredentialsModel.findOne(
        {
          where: { email: _email }
        },
        { raw: true }
      )

      if (!credentialsInDb) return None

      const credentialsInstance = makeCredentials(deserialize(credentialsInDb))

      if (credentialsInstance.is_err()) throw credentialsInstance.unwrap_err()

      return Some(credentialsInstance.unwrap())
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

  async function update(credentials: Credentials): ResultAsync<Credentials> {
    await _isDbReady

    try {
      await CredentialsModel.update(serialize(credentials), {
        where: { id: credentials.id }
      })
      return Ok(credentials)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Credentials.findAll error', error)
      return Err(error)
    }
  }
}

export { makeCredentialsRepo }
