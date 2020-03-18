import { DataTypes } from 'sequelize'

import isDbReady from './helpers/isDbReady'

import { ProjectAdmissionKeyRepo } from '../'
import { makeProjectAdmissionKey, ProjectAdmissionKey } from '../../entities'

export default function makeProjectAdmissionKeyRepo({
  sequelize
}): ProjectAdmissionKeyRepo {
  const ProjectAdmissionKeyModel = sequelize.define('projectAdmissionKey', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    insertMany,
    update
  })

  async function findById({ id }): Promise<ProjectAdmissionKey | null> {
    await _isDbReady

    const projectAdmissionKeyInDb = await ProjectAdmissionKeyModel.findByPk(id)
    return (
      projectAdmissionKeyInDb &&
      makeProjectAdmissionKey(projectAdmissionKeyInDb)
    )
  }

  async function findAll(query?): Promise<Array<ProjectAdmissionKey>> {
    await _isDbReady

    return (
      await ProjectAdmissionKeyModel.findAll(
        query
          ? {
              where: query
            }
          : {}
      )
    ).map(makeProjectAdmissionKey)
  }

  async function insertMany(projectAdmissionKeys: Array<ProjectAdmissionKey>) {
    await _isDbReady

    await Promise.all(
      projectAdmissionKeys.map(projectAdmissionKey =>
        ProjectAdmissionKeyModel.create(projectAdmissionKey)
      )
    )
  }

  async function update(projectAdmissionKey: ProjectAdmissionKey) {
    await _isDbReady

    if (!projectAdmissionKey.id) {
      throw new Error('Cannot update projectAdmissionKey that has no id')
    }

    await ProjectAdmissionKeyModel.update(projectAdmissionKey, {
      where: { id: projectAdmissionKey.id }
    })
  }
}

export { makeProjectAdmissionKeyRepo }
