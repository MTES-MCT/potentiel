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
    remove,
    addProject,
    findProjects
  })

  async function findById(id: User['id']): Promise<User | null> {
    await _isDbReady

    const user = await userModel.findOne({
      where: { id }
    })

    return user ? makeUser(user) : null
  }

  async function insert(user: User) {
    console.log('Call to User.insert')
    await _isDbReady

    const { id } = await userModel.create(user)
    return id.toString()
  }

  async function remove(id: User['id']) {
    await _isDbReady

    await userModel.destroy({ where: { id } })
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

  async function findProjects(userId: User['id']): Promise<Array<Project>> {
    const userInstance = await userModel.findByPk(userId)

    if (!userInstance) {
      throw new Error('Cannot find user to add project to')
    }

    return (await userInstance.getProjects({ raw: true })).map(makeProject)
  }
}

export { makeUserRepo }
