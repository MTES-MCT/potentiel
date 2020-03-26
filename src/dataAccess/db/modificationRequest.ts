import { DataTypes } from 'sequelize'
import { ModificationRequestRepo } from '../'
import { ModificationRequest, makeModificationRequest } from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = item => item
const serialize = item => item

export default function makeModificationRequestRepo({
  sequelize
}): ModificationRequestRepo {
  const ModificationRequestModel = sequelize.define('modificationRequest', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requestedBy: {
      type: DataTypes.UUID,
      allowNull: false
    },
    requestedOn: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    justification: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actionnaire: {
      type: DataTypes.STRING,
      allowNull: true
    },
    producteur: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fournisseur: {
      type: DataTypes.STRING,
      allowNull: true
    },
    puissance: {
      type: DataTypes.NUMBER,
      allowNull: true
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    insert,
    update
  })

  async function findById(
    id: ModificationRequest['id']
  ): OptionAsync<ModificationRequest> {
    await _isDbReady

    try {
      const modificationRequestInDb = await ModificationRequestModel.findByPk(
        id,
        { raw: true }
      )

      if (!modificationRequestInDb) return None

      const modificationRequestInstance = makeModificationRequest(
        deserialize(modificationRequestInDb)
      )

      if (modificationRequestInstance.is_err())
        throw modificationRequestInstance.unwrap_err()

      return Some(modificationRequestInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('ModificationRequest.findById error', error)
      return None
    }
  }

  async function findAll(
    query?: Record<string, any>
  ): Promise<Array<ModificationRequest>> {
    await _isDbReady

    try {
      const modificationRequestsRaw = await ModificationRequestModel.findAll(
        query
          ? {
              where: query
            }
          : {},
        { raw: true }
      )

      const deserializedItems = mapExceptError(
        modificationRequestsRaw,
        deserialize,
        'ModificationRequest.findAll.deserialize error'
      )

      return mapIfOk(
        deserializedItems,
        makeModificationRequest,
        'ModificationRequest.findAll.makeModificationRequest error'
      )
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('ModificationRequest.findAll error', error)
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
      if (CONFIG.logDbErrors)
        console.log('ModificationRequest.insert error', error)
      return Err(error)
    }
  }

  async function update(
    modificationRequest: ModificationRequest
  ): ResultAsync<ModificationRequest> {
    await _isDbReady

    try {
      await ModificationRequestModel.update(serialize(modificationRequest), {
        where: { id: modificationRequest.id }
      })
      return Ok(modificationRequest)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('ModificationRequest.findAll error', error)
      return Err(error)
    }
  }
}

export { makeModificationRequestRepo }
