import { DataTypes } from 'sequelize'

import isDbReady from './helpers/isDbReady'

import { UserRepo } from '../'
import { makeUser, User } from '../../entities'

export default function makeUserRepo({ sequelize }): UserRepo {
  const userModel = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    insert
  })

  async function findById({ id: _id }): Promise<User> {
    await _isDbReady

    const user = await userModel.findOne({
      where: { id: _id }
    })

    return user ? makeUser(user) : null
  }

  async function insert(user: User) {
    await _isDbReady

    await userModel.create(user)
  }
}

export { makeUserRepo }
