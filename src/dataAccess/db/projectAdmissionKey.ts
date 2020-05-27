import { DataTypes, Op } from 'sequelize'
import { ProjectAdmissionKeyRepo } from '../'
import { ProjectAdmissionKey, makeProjectAdmissionKey } from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  projectId: item.projectId || undefined,
  dreal: item.dreal || undefined,
})
const serialize = (item) => item

export default function makeProjectAdmissionKeyRepo({
  sequelize,
}): ProjectAdmissionKeyRepo {
  const ProjectAdmissionKeyModel = sequelize.define('projectAdmissionKey', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dreal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    insert,
  })

  async function findById(
    id: ProjectAdmissionKey['id']
  ): OptionAsync<ProjectAdmissionKey> {
    await _isDbReady

    try {
      const projectAdmissionKeyInDb = await ProjectAdmissionKeyModel.findByPk(
        id,
        { raw: true }
      )

      if (!projectAdmissionKeyInDb) return None

      const projectAdmissionKeyInstance = makeProjectAdmissionKey(
        deserialize(projectAdmissionKeyInDb)
      )

      if (projectAdmissionKeyInstance.is_err())
        throw projectAdmissionKeyInstance.unwrap_err()

      return Some(projectAdmissionKeyInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('ProjectAdmissionKey.findById error', error)
      return None
    }
  }

  async function findAll(
    query?: Record<string, any>
  ): Promise<Array<ProjectAdmissionKey>> {
    await _isDbReady

    try {
      const opts: any = {}
      if (query) {
        opts.where = query

        if (query.dreal === -1) {
          // Special case which means not null
          opts.where.dreal = { [Op.ne]: null }
        }
      }

      const projectAdmissionKeysRaw = await ProjectAdmissionKeyModel.findAll(
        opts
      )

      const deserializedItems = mapExceptError(
        projectAdmissionKeysRaw.map((item) => item.get()),
        deserialize,
        'ProjectAdmissionKey.findAll.deserialize error'
      )

      return mapIfOk(
        deserializedItems,
        makeProjectAdmissionKey,
        'ProjectAdmissionKey.findAll.makeProjectAdmissionKey error'
      )
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('ProjectAdmissionKey.findAll error', error)
      return []
    }
  }

  async function insert(
    projectAdmissionKey: ProjectAdmissionKey
  ): ResultAsync<ProjectAdmissionKey> {
    await _isDbReady

    try {
      await ProjectAdmissionKeyModel.create(serialize(projectAdmissionKey))
      return Ok(projectAdmissionKey)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('ProjectAdmissionKey.insert error', error)
      return Err(error)
    }
  }
}

export { makeProjectAdmissionKeyRepo }
