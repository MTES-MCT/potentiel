import { DataTypes } from 'sequelize'

import isDbReady from './helpers/isDbReady'

import { UserRepo } from '../'
import { makeUser, User, Project, makeProject } from '../../entities'

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
    insert,
    addProject,
    findProjects
  })

  async function findById({ id: _id }): Promise<User | null> {
    await _isDbReady

    const user = await userModel.findOne({
      where: { id: _id }
    })

    return user ? makeUser(user) : null
  }

  async function insert(user: User) {
    await _isDbReady

    const { id } = await userModel.create(user)
    return id.toString()
  }

  async function addProject(userId: string, projectId: string): Promise<void> {
    const userInstance = await userModel.findByPk(userId)

    if (!userInstance) {
      throw new Error('Cannot find user to add project to')
    }

    const projectModel = sequelize.model('project')
    const projectInstance = await projectModel.findByPk(projectId)

    if (!projectInstance) {
      throw new Error('Cannot find project to be added to user')
    }

    await userInstance.addProject(projectInstance)
  }

  async function findProjects(user: User): Promise<Array<Project>> {
    const userInstance = await userModel.findByPk(user.id)

    if (!userInstance) {
      throw new Error('Cannot find user to add project to')
    }

    return (await userInstance.getProjects({ raw: true })).map(makeProject)
  }
}

export { makeUserRepo }
