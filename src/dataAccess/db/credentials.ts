import { DataTypes } from 'sequelize'

import isDbReady from './helpers/isDbReady'

import { CredentialsRepo } from '../'
import { makeCredentials, Credentials } from '../../entities'

export default function makeCredentialsRepo({ sequelize }): CredentialsRepo {
  const credentialsModel = sequelize.define('credentials', {
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
    insert
  })

  async function findByEmail({ email: _email }): Promise<Credentials | null> {
    await _isDbReady

    const credentials = await credentialsModel.findOne({
      where: { email: _email }
    })

    return credentials ? makeCredentials(credentials) : null
  }

  async function insert(credentials: Credentials) {
    await _isDbReady

    await credentialsModel.create(credentials)
  }
}

export { makeCredentialsRepo }
