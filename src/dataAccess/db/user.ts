import { DataTypes } from 'sequelize'
import { UserRepo } from '../'
import { User, makeUser, Project, makeProject } from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => item
const serialize = (item) => item

export default function makeUserRepo({ sequelize }): UserRepo {
  const UserModel = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    insert,
    update,
    addProject,
    remove,
    hasProject,
  })

  async function findById(id: User['id']): OptionAsync<User> {
    await _isDbReady

    try {
      const userInDb = await UserModel.findByPk(id, { raw: true })

      if (!userInDb) return None

      const userInstance = makeUser(deserialize(userInDb))

      if (userInstance.is_err()) throw userInstance.unwrap_err()

      return Some(userInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.findById error', error)
      return None
    }
  }

  async function findAll(query?: Record<string, any>): Promise<Array<User>> {
    await _isDbReady

    try {
      const usersRaw = await UserModel.findAll(
        query
          ? {
              where: query,
            }
          : {},
        { raw: true }
      )

      const deserializedItems = mapExceptError(
        usersRaw,
        deserialize,
        'User.findAll.deserialize error'
      )

      return mapIfOk(deserializedItems, makeUser, 'User.findAll.makeUser error')
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.findAll error', error)
      return []
    }
  }

  async function insert(user: User): ResultAsync<User> {
    await _isDbReady

    try {
      await UserModel.create(serialize(user))
      return Ok(user)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.insert error', error)
      return Err(error)
    }
  }

  async function update(user: User): ResultAsync<User> {
    await _isDbReady

    try {
      await UserModel.update(serialize(user), {
        where: { id: user.id },
      })
      return Ok(user)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.findAll error', error)
      return Err(error)
    }
  }

  async function addProject(
    userId: User['id'],
    projectId: Project['id']
  ): ResultAsync<void> {
    try {
      // Check if user already has access to this project
      const priorAccess = await hasProject(userId, projectId)
      if (priorAccess) return Ok(null)

      const userInstance = await UserModel.findByPk(userId)

      if (!userInstance) {
        throw new Error('Cannot find user to add project to')
      }

      const ProjectModel = sequelize.model('project')
      const projectInstance = await ProjectModel.findByPk(projectId)

      if (!projectInstance) {
        throw new Error('Cannot find project to be added to user')
      }

      await userInstance.addProject(projectInstance)
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.addProject error', error)
      return Err(error)
    }
  }

  async function hasProject(
    userId: User['id'],
    projectId: Project['id']
  ): Promise<boolean> {
    try {
      const userInstance = await UserModel.findByPk(userId)

      if (!userInstance) {
        throw new Error('Cannot find user')
      }

      const ProjectModel = sequelize.model('project')
      const projectInstance = await ProjectModel.findByPk(projectId)

      if (!projectInstance) {
        throw new Error('Cannot find project')
      }

      return await userInstance.hasProject(projectInstance)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.hasProject error', error)
      return false
    }
  }

  async function remove(id: User['id']): ResultAsync<void> {
    await _isDbReady

    try {
      await UserModel.destroy({ where: { id } })
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.remove error', error)
      return Err(error)
    }
  }
}

export { makeUserRepo }
