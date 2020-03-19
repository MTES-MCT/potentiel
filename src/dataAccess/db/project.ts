import { DataTypes } from 'sequelize'
import { ProjectRepo } from '../'
import {
  Project,
  User,
  makeProject,
  CandidateNotification
} from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { Err, None, Ok, OptionAsync, ResultAsync, Some } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = item => ({
  ...item,
  hasBeenNotified: !!item.hasBeenNotified
})
const serialize = item => item

export default function makeProjectRepo({ sequelize }): ProjectRepo {
  const ProjectModel = sequelize.define('project', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    periode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numeroCRE: {
      type: DataTypes.STRING,
      allowNull: false
    },
    famille: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomCandidat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    puissance: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    prixReference: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    evaluationCarbone: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    note: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    nomRepresentantLegal: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adresseProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codePostalProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    communeProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departementProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    regionProjet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classe: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fournisseur: {
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
    motifsElimination: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hasBeenNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    findByUser,
    insert,
    update,
    remove,
    addNotification
  })

  async function findById(id: Project['id']): OptionAsync<Project> {
    await _isDbReady

    try {
      const projectInDb = await ProjectModel.findByPk(id, { raw: true })

      if (!projectInDb) return None

      const projectInstance = makeProject(deserialize(projectInDb))

      if (projectInstance.is_err()) throw projectInstance.unwrap_err()

      return Some(projectInstance.unwrap())
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.findById error', error)
      return None
    }
  }

  async function findAll(
    query?: Record<string, any>,
    includeNotifications?: boolean
  ): Promise<Array<Project>> {
    await _isDbReady

    try {
      const CandidateNotificationModel = sequelize.model(
        'candidateNotification'
      )

      const opts: any = {}
      if (query) opts.where = query
      if (includeNotifications) opts.include = CandidateNotificationModel

      const projectsRaw = (
        await ProjectModel.findAll({
          ...opts
        })
      ).map(item => item.get()) // We need to use this instead of raw: true because of the include

      const deserializedItems = mapExceptError(
        projectsRaw,
        deserialize,
        'Project.findAll.deserialize error'
      )

      return mapIfOk(
        deserializedItems,
        makeProject,
        'Project.findAll.makeProject error'
      )
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.findAll error', error)
      return []
    }
  }

  async function findByUser(userId: User['id']): Promise<Array<Project>> {
    try {
      const UserModel = sequelize.model('user')
      const userInstance = await UserModel.findByPk(userId)
      if (!userInstance) {
        if (CONFIG.logDbErrors)
          console.log('Cannot find user to get projects from')

        return []
      }

      const rawProjects = await userInstance.getProjects({ raw: true })

      const deserializedItems = mapExceptError(
        rawProjects,
        deserialize,
        'Project.findAll.deserialize error'
      )

      return mapIfOk(
        deserializedItems,
        makeProject,
        'Project.findByUser.makeProject error'
      )
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('User.findProjects error', error)
      return []
    }
  }

  async function insert(project: Project): ResultAsync<Project> {
    await _isDbReady

    try {
      await ProjectModel.create(serialize(project))
      return Ok(project)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.insert error', error)
      return Err(error)
    }
  }

  async function update(project: Project): ResultAsync<Project> {
    await _isDbReady

    try {
      await ProjectModel.update(serialize(project), {
        where: { id: project.id }
      })
      return Ok(project)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.findAll error', error)
      return Err(error)
    }
  }

  async function remove(id: Project['id']): ResultAsync<void> {
    await _isDbReady

    try {
      await ProjectModel.destroy({ where: { id } })
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.remove error', error)
      return Err(error)
    }
  }

  async function addNotification(
    project: Project,
    notification: CandidateNotification
  ): ResultAsync<Project> {
    await _isDbReady

    try {
      const projectInstance = await ProjectModel.findByPk(project.id)

      if (!projectInstance) {
        throw new Error('Cannot find project to add notification to')
      }

      const CandidateNotificationModel = sequelize.model(
        'candidateNotification'
      )

      const candidateNotificationInstance = await CandidateNotificationModel.findByPk(
        notification.id
      )

      if (!candidateNotificationInstance)
        throw new Error('CandidateNotification not found')

      await projectInstance.addCandidateNotification(
        candidateNotificationInstance
      )
      await projectInstance.update({ hasBeenNotified: true })
      project.hasBeenNotified = true

      return Ok(project)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.addNotification error', error)
      return Err(error)
    }
  }
}

export { makeProjectRepo }
