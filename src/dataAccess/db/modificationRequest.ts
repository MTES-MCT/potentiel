import { DataTypes } from 'sequelize'
import { ModificationRequestRepo } from '../'
import { ModificationRequest, makeModificationRequest } from '@entities'
import { mapExceptError } from '../../helpers/results'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'
import { logger } from '@core/utils'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  filename: item.filename || undefined,
  fileId: item.fileId || undefined,
  justification: item.justification || undefined,
  actionnaire: item.actionnaire || undefined,
  fournisseur: item.fournisseur || undefined,
  producteur: item.producteur || undefined,
  puissance: item.puissance || undefined,
})
const serialize = (item) => item

export default function makeModificationRequestRepo({
  sequelizeInstance,
}): ModificationRequestRepo {
  const ModificationRequestModel = sequelizeInstance.define('modificationRequest', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestedOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actionnaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    producteur: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fournisseur: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    puissance: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    evaluationCarbone: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    delayInMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  })

  const FileModel = sequelizeInstance.define(
    'files',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      forProject: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storedAt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )
  ModificationRequestModel.belongsTo(FileModel, {
    foreignKey: 'fileId',
    as: 'attachmentFile',
  })

  const _isDbReady = isDbReady({ sequelizeInstance })

  return Object.freeze({
    findById,
    findAll,
    insert,
    update,
  })

  async function findById(id: ModificationRequest['id']): OptionAsync<ModificationRequest> {
    await _isDbReady

    try {
      const modificationRequestInDb = await ModificationRequestModel.findByPk(id, {
        include: [
          {
            model: FileModel,
            as: 'attachmentFile',
            attributes: ['id', 'filename'],
          },
        ],
        raw: true,
      })

      if (!modificationRequestInDb) return None

      const modificationRequestInstance = makeModificationRequest(
        deserialize(modificationRequestInDb)
      )

      if (modificationRequestInstance.is_err()) throw modificationRequestInstance.unwrap_err()

      return Some(modificationRequestInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return None
    }
  }

  async function findAll(
    query?: Record<string, any>,
    includeInfo?: boolean
  ): Promise<Array<ModificationRequest>> {
    await _isDbReady

    try {
      const ProjectModel = sequelizeInstance.model('project')
      const UserModel = sequelizeInstance.model('user')

      const opts: any = {
        include: [
          {
            model: FileModel,
            as: 'attachmentFile',
            attributes: ['id', 'filename'],
          },
        ],
      }
      if (query) opts.where = query
      if (includeInfo) opts.include.push(ProjectModel, UserModel)

      const modificationRequestsRaw = (await ModificationRequestModel.findAll(opts))
        .map((item) => item.get())
        .map((item) => ({
          ...item,
          user: item.user?.get(),
          project: item.project?.get(),
        }))

      const deserializedItems = mapExceptError(
        modificationRequestsRaw,
        deserialize,
        'ModificationRequest.findAll.deserialize error'
      )

      return deserializedItems
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return []
    }
  }

  async function insert(
    modificationRequest: ModificationRequest
  ): ResultAsync<ModificationRequest> {
    await _isDbReady

    try {
      await ModificationRequestModel.create(serialize(modificationRequest))
      return Ok(modificationRequest)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return Err(error)
    }
  }

  async function update(
    modificationRequest: ModificationRequest
  ): ResultAsync<ModificationRequest> {
    await _isDbReady

    try {
      await ModificationRequestModel.update(serialize(modificationRequest), {
        where: { id: modificationRequest.id },
      })
      return Ok(modificationRequest)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return Err(error)
    }
  }
}

export { makeModificationRequestRepo }
