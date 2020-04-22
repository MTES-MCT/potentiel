import { DataTypes, Op } from 'sequelize'
import { ProjectRepo } from '../'
import {
  Project,
  User,
  makeProject,
  CandidateNotification,
} from '../../entities'
import { mapExceptError, mapIfOk } from '../../helpers/results'
import { paginate, pageCount, makePaginatedList } from '../../helpers/paginate'
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
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  isFinancementParticipatif: item.isFinancementParticipatif === 1,
  isInvestissementParticipatif: item.isInvestissementParticipatif === 1,
  engagementFournitureDePuissanceAlaPointe:
    item.engagementFournitureDePuissanceAlaPointe === 1,
  actionnaire: item.actionnaire || '',
  territoireProjet: item.territoireProjet || undefined,
})
const serialize = (item) => item

export default function makeProjectRepo({ sequelize }): ProjectRepo {
  const ProjectModel = sequelize.define('project', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    appelOffreId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    periodeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numeroCRE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomCandidat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomProjet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    puissance: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    prixReference: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    evaluationCarbone: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    note: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    nomRepresentantLegal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adresseProjet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codePostalProjet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    communeProjet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departementProjet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    territoireProjet: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    regionProjet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fournisseur: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actionnaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motifsElimination: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isFinancementParticipatif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isInvestissementParticipatif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    engagementFournitureDePuissanceAlaPointe: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    notifiedOn: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
  })

  const _isDbReady = isDbReady({ sequelize })

  return Object.freeze({
    findById,
    findAll,
    findByUser,
    insert,
    update,
    remove,
    addNotification,
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

  async function findAll(query?: Record<string, any>): Promise<Array<Project>>
  async function findAll(
    query: Record<string, any>,
    pagination: Pagination
  ): Promise<PaginatedList<Project>>
  async function findAll(
    query?: Record<string, any>,
    pagination?: Pagination
  ): Promise<PaginatedList<Project> | Array<Project>> {
    await _isDbReady

    try {
      const opts: any = {}
      if (query) opts.where = query

      if (pagination) {
        const { count, rows } = await ProjectModel.findAndCountAll({
          ...opts,
          ...paginate(pagination),
        })

        const projectsRaw = rows.map((item) => item.get()) // We need to use this instead of raw: true because of the include

        const deserializedItems = mapExceptError(
          projectsRaw,
          deserialize,
          'Project.findAll.deserialize error'
        )

        const projects = mapIfOk(
          deserializedItems,
          makeProject,
          'Project.findAll.makeProject error'
        )

        return makePaginatedList(projects, pagination, count)
      }

      const rows = await ProjectModel.findAll(opts)

      const projectsRaw = rows.map((item) => item.get()) // We need to use this instead of raw: true because of the include

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
      if (CONFIG.logDbErrors)
        console.log('Project.findAndCountAll error', error)
      return pagination ? makePaginatedList([], pagination, 0) : []
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

      const rawProjects = await userInstance.getProjects({
        where: { notifiedOn: { [Op.ne]: 0 } },
        raw: true,
      })

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
      // console.log('Inserting project', project)
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
        where: { id: project.id },
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

      return Ok(project)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.addNotification error', error)
      return Err(error)
    }
  }
}

export { makeProjectRepo }
