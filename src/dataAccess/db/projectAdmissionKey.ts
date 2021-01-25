import { DataTypes, Op } from 'sequelize'
import moment from 'moment'
import { ProjectAdmissionKeyRepo } from '../'
import { ProjectAdmissionKey, makeProjectAdmissionKey } from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import {
  Err,
  None,
  Ok,
  OptionAsync,
  ResultAsync,
  Some,
  Pagination,
  PaginatedList,
} from '../../types'
import { paginate, makePaginatedList } from '../../helpers/paginate'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'
import { logger } from '../../core/utils'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  projectId: item.projectId || undefined,
  appelOffreId: item.appelOffreId || undefined,
  periodeId: item.periodeId || undefined,
  dreal: item.dreal || undefined,
  lastUsedAt: item.lastUsedAt || undefined,
  createdAt: item.createdAt.getTime(),
})
const serialize = (item) => item

export default function makeProjectAdmissionKeyRepo({
  sequelizeInstance,
}): ProjectAdmissionKeyRepo {
  const ProjectAdmissionKeyModel = sequelizeInstance.define('projectAdmissionKey', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    appelOffreId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    periodeId: {
      type: DataTypes.STRING,
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
    lastUsedAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  })

  const _isDbReady = isDbReady({ sequelizeInstance })

  return Object.freeze({
    findById,
    findAll,
    getList,
    save,
  })

  async function findById(id: ProjectAdmissionKey['id']): OptionAsync<ProjectAdmissionKey> {
    await _isDbReady

    try {
      const projectAdmissionKeyInDb = await ProjectAdmissionKeyModel.findByPk(id)

      if (!projectAdmissionKeyInDb) return None

      const projectAdmissionKeyInstance = makeProjectAdmissionKey(
        deserialize(projectAdmissionKeyInDb.get())
      )

      if (projectAdmissionKeyInstance.is_err()) throw projectAdmissionKeyInstance.unwrap_err()

      return Some(projectAdmissionKeyInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return None
    }
  }

  async function findAll(query?: Record<string, any>): Promise<Array<ProjectAdmissionKey>> {
    await _isDbReady

    try {
      const opts: any = {}
      if (query) {
        opts.where = query

        if (query.dreal === -1) {
          // Special case which means not null
          opts.where.dreal = { [Op.ne]: null }
        }

        if (query.dreal === null) {
          opts.where.dreal = { [Op.eq]: null }
        }

        if (query.projectId === null) {
          opts.where.projectId = { [Op.eq]: null }
        }

        if (typeof query.createdAt === 'object' && query.createdAt.before) {
          opts.where.createdAt = {
            [Op.lte]: moment(query.createdAt.before).toDate(),
          }
        }
      }

      opts.order = [['createdAt', 'DESC']]

      const projectAdmissionKeysRaw = await ProjectAdmissionKeyModel.findAll(opts)

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
      if (CONFIG.logDbErrors) logger.error(error)
      return []
    }
  }

  async function getList(
    query: Record<string, any>,
    pagination: Pagination
  ): Promise<PaginatedList<ProjectAdmissionKey>> {
    await _isDbReady

    try {
      const opts: any = {}
      if (query) {
        opts.where = query

        if (query.dreal === -1) {
          // Special case which means not null
          opts.where.dreal = { [Op.ne]: null }
        }

        if (query.dreal === null) {
          opts.where.dreal = { [Op.eq]: null }
        }

        if (query.projectId === null) {
          opts.where.projectId = { [Op.eq]: null }
        }

        if (typeof query.createdAt === 'object' && query.createdAt.before) {
          opts.where.createdAt = {
            [Op.lte]: moment(query.createdAt.before).toDate(),
          }
        }
      }

      opts.order = [['createdAt', 'DESC']]

      const { count, rows } = await ProjectAdmissionKeyModel.findAndCountAll({
        ...opts,
        ...paginate(pagination),
      })

      const deserializedItems = mapExceptError(
        rows.map((item) => item.get()),
        deserialize,
        'ProjectAdmissionKey.findAll.deserialize error'
      )

      return makePaginatedList(deserializedItems, count, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function save(projectAdmissionKey: ProjectAdmissionKey): ResultAsync<null> {
    await _isDbReady

    try {
      await ProjectAdmissionKeyModel.upsert(serialize(projectAdmissionKey))
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return Err(error)
    }
  }
}

export { makeProjectAdmissionKeyRepo }
