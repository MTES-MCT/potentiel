import { DataTypes, Op, QueryTypes } from 'sequelize'
import _ from 'lodash'
import {
  ContextSpecificProjectListFilter,
  ProjectFilters,
  ProjectRepo,
} from '../'
import {
  AppelOffre,
  DREAL,
  Famille,
  makeProject,
  Periode,
  Project,
  User,
  makeProjectIdentifier,
} from '../../entities'
import { makePaginatedList, paginate } from '../../helpers/paginate'
import { mapExceptError } from '../../helpers/results'
import { Err, Ok, PaginatedList, Pagination, ResultAsync } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  actionnaire: item.actionnaire || '',
  territoireProjet: item.territoireProjet || undefined,
  garantiesFinancieresDate: item.garantiesFinancieresDate || 0,
  garantiesFinancieresFile: item.garantiesFinancieresFile || '',
  garantiesFinancieresDueOn: item.garantiesFinancieresDueOn || 0,
  garantiesFinancieresRelanceOn: item.garantiesFinancieresRelanceOn || 0,
  garantiesFinancieresSubmittedOn: item.garantiesFinancieresSubmittedOn || 0,
  garantiesFinancieresSubmittedBy: item.garantiesFinancieresSubmittedBy || '',
  dcrDate: item.dcrDate || 0,
  dcrFile: item.dcrFile || '',
  dcrDueOn: item.dcrDueOn || 0,
  dcrSubmittedOn: item.dcrSubmittedOn || 0,
  dcrSubmittedBy: item.dcrSubmittedBy || '',
  dcrNumeroDossier: item.dcrNumeroDossier || '',
})
const serialize = (item) => item

const initSearchIndex = async (sequelize) => {
  // Set up the virtual table
  try {
    await sequelize.query(
      'CREATE VIRTUAL TABLE IF NOT EXISTS project_search USING fts3(id UUID, nomCandidat VARCHAR(255), nomProjet VARCHAR(255), nomRepresentantLegal VARCHAR(255), email VARCHAR(255), adresseProjet VARCHAR(255), codePostalProjet VARCHAR(255), communeProjet VARCHAR(255), departementProjet VARCHAR(255), regionProjet VARCHAR(255), numeroCRE VARCHAR(255), identifier VARCHAR(255));'
    )
    // console.log('Done create project_search virtual table')
  } catch (error) {
    console.error('Unable to create project_search virtual table', error)
  }
}

export default function makeProjectRepo({
  sequelize,
  appelOffreRepo,
}): ProjectRepo {
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
    garantiesFinancieresDueOn: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresRelanceOn: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresSubmittedOn: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresDate: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    garantiesFinancieresSubmittedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dcrDueOn: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    dcrSubmittedOn: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    dcrDate: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    dcrFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dcrNumeroDossier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dcrSubmittedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  })

  const ProjectEventModel = sequelize.define('projectEvent', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    before: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('before')
        let parsedValue = {}
        try {
          if (rawValue) parsedValue = JSON.parse(rawValue)
        } catch (e) {
          console.log(
            'ProjectEventModel failed to parse before rawValue:',
            rawValue
          )
        }
        return parsedValue
      },
      set(value) {
        this.setDataValue('before', JSON.stringify(value))
      },
      allowNull: false,
    },
    after: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('after')

        let parsedValue = {}
        try {
          if (rawValue) parsedValue = JSON.parse(rawValue)
        } catch (e) {
          console.log(
            'ProjectEventModel failed to parse after rawValue:',
            rawValue
          )
        }
        return parsedValue
      },
      set(value) {
        this.setDataValue('after', JSON.stringify(value))
      },
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.NUMBER,
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
    modificationRequestId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  })

  ProjectModel.hasMany(ProjectEventModel)
  ProjectEventModel.belongsTo(ProjectModel, {
    foreignKey: 'projectId',
  })

  const _isDbReady = isDbReady({ sequelize }).then(() =>
    initSearchIndex(sequelize)
  )

  return Object.freeze({
    findById,
    findOne,
    findAll,
    save,
    index: _indexProject,
    remove,
    getUsers,
    findExistingAppelsOffres,
    findExistingFamillesForAppelOffre,
    findExistingPeriodesForAppelOffre,
    searchForUser,
    findAllForUser,
    searchForRegions,
    findAllForRegions,
    searchAll,
    countUnnotifiedProjects,
    findProjectsWithGarantiesFinancieresPendingBefore,
  })

  async function addAppelOffreToProject(project: Project): Promise<Project> {
    project.appelOffre = await appelOffreRepo.findById(project.appelOffreId)

    if (!project.appelOffre) return project

    project.appelOffre.periode = project.appelOffre.periodes.find(
      (periode) => periode.id === project.periodeId
    )

    project.famille = project.appelOffre.familles.find(
      (famille) => famille.id === project.familleId
    )

    return project
  }

  async function findById(
    id: Project['id'],
    includeHistory?: true
  ): Promise<Project | undefined> {
    await _isDbReady

    try {
      const projectInDb = await ProjectModel.findByPk(id)
      if (!projectInDb) return

      const projectInstance = makeProject(deserialize(projectInDb.get()))

      if (projectInstance.is_err()) {
        throw projectInstance.unwrap_err()
      }

      const projectWithAppelOffre = await addAppelOffreToProject(
        projectInstance.unwrap()
      )

      if (includeHistory) {
        projectWithAppelOffre.history = (
          await projectInDb.getProjectEvents()
        ).map((item) => item.get())
      }

      return projectWithAppelOffre
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.findById error', error)
    }
  }

  async function findOne(query: ProjectFilters): Promise<Project | undefined> {
    await _isDbReady

    try {
      const projectInDb = await ProjectModel.findOne({
        where: query,
      })

      if (!projectInDb) return

      const projectInstance = makeProject(deserialize(projectInDb.get()))

      if (projectInstance.is_err()) throw projectInstance.unwrap_err()

      const projectWithAppelOffre = await addAppelOffreToProject(
        projectInstance.unwrap()
      )
      return projectWithAppelOffre
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.findOne error', error)
    }
  }

  function _makeSelectorsForQuery(query?: ProjectFilters) {
    const opts: any = { where: {} }

    if (query) {
      opts.where = {}

      if ('isNotified' in query) {
        opts.where.notifiedOn = query.isNotified ? { [Op.ne]: 0 } : 0
      }

      if ('hasGarantiesFinancieres' in query) {
        opts.where.garantiesFinancieresSubmittedOn = query.hasGarantiesFinancieres
          ? { [Op.ne]: 0 }
          : 0
      }

      if ('isClasse' in query) {
        opts.where.classe = query.isClasse ? 'Classé' : 'Eliminé'
      }

      if ('appelOffreId' in query) {
        opts.where.appelOffreId = query.appelOffreId
      }

      if ('periodeId' in query) {
        opts.where.periodeId = query.periodeId
      }

      if ('familleId' in query) {
        opts.where.familleId = query.familleId
      }

      if ('email' in query) {
        opts.where.email = query.email
      }

      if ('nomProjet' in query) {
        opts.where.nomProjet = query.nomProjet
      }

      // Region can be of shape 'region1 / region2' so equality does not work
      // if (typeof query.regionProjet === 'string') {
      //   opts.where.regionProjet = {
      //     [Op.substring]: query.regionProjet,
      //   }
      // } else if (
      //   Array.isArray(query.regionProjet) &&
      //   query.regionProjet.length
      // ) {
      //   opts.where.regionProjet = {
      //     [Op.or]: query.regionProjet.map((region) => ({
      //       [Op.substring]: region,
      //     })),
      //   }
      // }
    }

    return opts
  }

  async function _findAndBuildProjectList(
    opts: Record<any, any>,
    pagination?: Pagination,
    filterFn?: (project: Project) => boolean
  ): Promise<PaginatedList<Project>> {
    const { count, rows } = await ProjectModel.findAndCountAll({
      ...opts,
      ...paginate(pagination),
    })

    const projectsRaw = rows
      .map((item) => item.get())
      // Double check the list of projects if filterFn is given
      .filter(filterFn || (() => true))

    if (projectsRaw.length !== rows.length) {
      console.log(
        'WARNING: searchForRegions had intermediate results that did not match region. Something must be wrong in the query.'
      )
    }

    const deserializedItems = mapExceptError(
      projectsRaw,
      deserialize,
      'Project._getProjectsWithIds.deserialize error'
    )

    const projects = await Promise.all(
      deserializedItems.map(addAppelOffreToProject)
    )

    // const projects = mapIfOk(
    //   deserializedItems,
    //   makeProject,
    //   'Project.findAll.makeProject error'
    // )

    return makePaginatedList(projects, count, pagination)
  }

  async function _getProjectIdsForUser(
    userId: User['id'],
    filters?: ProjectFilters
  ): Promise<Project['id'][]> {
    await _isDbReady

    const UserModel = sequelize.model('user')
    const userInstance = await UserModel.findByPk(userId)
    if (!userInstance) {
      if (CONFIG.logDbErrors)
        console.log('Cannot find user to get projects from')

      return []
    }

    return (
      await userInstance.getProjects(_makeSelectorsForQuery(filters))
    ).map((item) => item.get().id)
  }

  async function _searchWithinGivenIds(
    term: string,
    projectIds: Project['id'][]
  ) {
    const projects = await sequelize.query(
      'SELECT id from project_search WHERE project_search MATCH :recherche AND id IN (:projectIds);',
      {
        replacements: {
          recherche: term
            .split(' ')
            .map((token) => '*' + token + '*')
            .join(' '),
          projectIds,
        },
        type: QueryTypes.SELECT,
      }
    )

    return projects.map((item) => item.id)
  }

  async function _getProjectsWithIds(
    projectIds: Project['id'][],
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    const opts = {
      where: {
        id: projectIds,
      },
    }

    return _findAndBuildProjectList(opts, pagination, (project) =>
      projectIds.includes(project.id)
    )
  }

  async function searchForUser(
    userId: User['id'],
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const filteredUserProjectIds = await _getProjectIdsForUser(
        userId,
        filters
      )

      if (!filteredUserProjectIds.length)
        return makePaginatedList([], 0, pagination)

      const searchedUserProjectIds = await _searchWithinGivenIds(
        terms,
        filteredUserProjectIds
      )

      if (!searchedUserProjectIds.length)
        return makePaginatedList([], 0, pagination)

      return _getProjectsWithIds(searchedUserProjectIds, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.searchForUser error', error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function findAllForUser(
    userId: User['id'],
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const filteredUserProjectIds = await _getProjectIdsForUser(
        userId,
        filters
      )

      if (!filteredUserProjectIds.length)
        return makePaginatedList([], 0, pagination)

      return _getProjectsWithIds(filteredUserProjectIds, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.findAllForUser error', error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function _searchWithinRegions(
    term: string,
    regions: DREAL | DREAL[]
  ): Promise<Project['id'][]> {
    const termQuery = term
      .split(' ')
      .map((token) => '*' + token + '*')
      .join(' OR ')
    const regionQuery = Array.isArray(regions)
      ? regions.map((region) => 'regionProjet:' + region).join(' OR ')
      : 'regionProjet:' + regions
    const projects = await sequelize.query(
      'SELECT id FROM project_search WHERE project_search MATCH :query;',
      {
        replacements: {
          query: '(' + termQuery + ') AND (' + regionQuery + ')',
        },
        type: QueryTypes.SELECT,
      }
    )

    return projects.map((item) => item.id)
  }

  async function searchForRegions(
    regions: DREAL | DREAL[],
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const searchedRegionProjectIds = await _searchWithinRegions(
        terms,
        regions
      )

      if (!searchedRegionProjectIds.length)
        return makePaginatedList([], 0, pagination)

      const opts = _makeSelectorsForQuery(filters)

      opts.where.id = searchedRegionProjectIds

      return _findAndBuildProjectList(opts, pagination, (project) =>
        project.regionProjet
          .split(' / ')
          .some((region) => regions.includes(region as DREAL))
      )
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.searchForRegions error', error)
      return makePaginatedList([], 0, pagination)
    }
  }

  function _makeRegionSelector(regions: DREAL | DREAL[]) {
    // Region can be of shape 'region1 / region2' so simple equality does not work
    if (Array.isArray(regions) && regions.length) {
      return {
        [Op.or]: regions.map((region) => ({
          [Op.substring]: region,
        })),
      }
    } else {
      return {
        [Op.substring]: regions,
      }
    }
  }

  async function findAllForRegions(
    regions: DREAL | DREAL[],
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const opts = _makeSelectorsForQuery(filters)

      opts.where.regionProjet = _makeRegionSelector(regions)

      return _findAndBuildProjectList(opts, pagination, (project) =>
        project.regionProjet
          .split(' / ')
          .some((region) => regions.includes(region as DREAL))
      )
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.searchForUser error', error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function _search(term: string): Promise<Project['id'][]> {
    const projects = await sequelize.query(
      'SELECT id FROM project_search WHERE project_search MATCH :query;',
      {
        replacements: {
          query: term
            .split(' ')
            .map((token) => '*' + token + '*')
            .join(' OR '),
        },
        type: QueryTypes.SELECT,
      }
    )

    return projects.map((item) => item.id)
  }

  async function searchAll(
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const searchResultIds = await _search(terms)

      if (!searchResultIds.length) return makePaginatedList([], 0, pagination)

      const opts = _makeSelectorsForQuery(filters)

      opts.where.id = searchResultIds

      return _findAndBuildProjectList(opts, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.searchAll error', error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function findAll(
    query?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const opts = _makeSelectorsForQuery(query)

      return _findAndBuildProjectList(opts, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.findAndCountAll error', error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function countUnnotifiedProjects(
    appelOffreId: AppelOffre['id'],
    periodeId: Periode['id']
  ): Promise<number> {
    await _isDbReady
    try {
      const opts = _makeSelectorsForQuery({
        appelOffreId,
        periodeId,
        isNotified: false,
      })

      return await ProjectModel.count(opts)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.countUnnotifiedProjects error', error)
      return 0
    }
  }

  async function _indexProject(project: Project) {
    // update the search index (delete then insert)
    await sequelize.query('DELETE FROM project_search where id is :id;', {
      replacements: project,
      type: QueryTypes.DELETE,
    })
    await sequelize.query(
      'INSERT INTO project_search(id, nomCandidat, nomProjet, nomRepresentantLegal, email, adresseProjet, codePostalProjet, communeProjet, departementProjet, regionProjet, numeroCRE, identifier) VALUES(:id, :nomCandidat, :nomProjet, :nomRepresentantLegal, :email, :adresseProjet, :codePostalProjet, :communeProjet, :departementProjet, :regionProjet, :numeroCRE, :identifier);',
      {
        replacements: {
          ...project,
          identifier: makeProjectIdentifier(project),
        },
        type: QueryTypes.INSERT,
      }
    )
  }

  async function _updateProjectHistory(project: Project) {
    // Check if the event history needs updating
    const newEvents = project.history?.filter((event) => event.isNew)
    if (newEvents && newEvents.length) {
      // New events found
      // Save them in the ProjectEvent table
      try {
        await Promise.all(
          newEvents
            .map((newEvent) => ({
              ...newEvent,
              projectId: project.id,
            }))
            .map((newEvent) =>
              ProjectEventModel.create(newEvent /*, { transaction }*/)
            )
        )
      } catch (error) {
        console.log('projectRepo.save error when saving newEvents', error)
      }
    }
  }

  async function save(project: Project): ResultAsync<null> {
    await _isDbReady

    try {
      const existingProject = await ProjectModel.findByPk(project.id)

      if (existingProject) {
        await existingProject.update(project)
      } else {
        await ProjectModel.create(project)
      }

      await _indexProject(project)

      await _updateProjectHistory(project)

      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.save error', error)
      return Err(error)
    }
  }

  async function remove(id: Project['id']): ResultAsync<null> {
    await _isDbReady

    try {
      await ProjectModel.destroy({ where: { id } })
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) console.log('Project.remove error', error)
      return Err(error)
    }
  }

  async function getUsers(projectId: Project['id']): Promise<Array<User>> {
    await _isDbReady

    const projectInstance = await ProjectModel.findByPk(projectId)

    if (!projectInstance) {
      return []
    }

    return (await projectInstance.getUsers()).map((item) => item.get())
  }

  async function findExistingAppelsOffres(
    options?: ContextSpecificProjectListFilter
  ): Promise<Array<AppelOffre['id']>> {
    await _isDbReady

    try {
      const opts: any = { where: {} }

      if (!options) {
      } else if ('userId' in options) {
        opts.where.id = await _getProjectIdsForUser(options.userId)
        opts.where.notifiedOn = { [Op.ne]: 0 }
      } else if ('regions' in options) {
        opts.where.regionProjet = _makeRegionSelector(options.regions)
        opts.where.notifiedOn = { [Op.ne]: 0 }
      } else if ('isNotified' in options) {
        opts.where.notifiedOn = options.isNotified ? { [Op.ne]: 0 } : 0
      }

      const appelsOffres = await ProjectModel.findAll({
        attributes: ['appelOffreId'],
        group: ['appelOffreId'],
        ...opts,
      })

      return appelsOffres.map((item) => item.get().appelOffreId)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.findExistingAppelsOffres error', error)
      return []
    }
  }

  async function findExistingPeriodesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter
  ): Promise<Array<Periode['id']>> {
    await _isDbReady

    try {
      const opts: any = { where: { appelOffreId } }

      if (!options) {
      } else if ('userId' in options) {
        opts.where.id = await _getProjectIdsForUser(options.userId)
        opts.where.notifiedOn = { [Op.ne]: 0 }
      } else if ('regions' in options) {
        opts.where.regionProjet = _makeRegionSelector(options.regions)
        opts.where.notifiedOn = { [Op.ne]: 0 }
      } else if ('isNotified' in options) {
        opts.where.notifiedOn = options.isNotified ? { [Op.ne]: 0 } : 0
      }

      const periodes = await ProjectModel.findAll({
        attributes: ['periodeId'],
        group: ['periodeId'],
        ...opts,
      })

      return periodes.map((item) => item.get().periodeId)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.findExistingPeriodesForAppelOffre error', error)
      return []
    }
  }

  async function findExistingFamillesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter
  ): Promise<Array<Famille['id']>> {
    await _isDbReady

    try {
      const opts: any = { where: { appelOffreId } }

      if (!options) {
      } else if ('userId' in options) {
        opts.where.id = await _getProjectIdsForUser(options.userId)
        opts.where.notifiedOn = { [Op.ne]: 0 }
      } else if ('regions' in options) {
        opts.where.regionProjet = _makeRegionSelector(options.regions)
        opts.where.notifiedOn = { [Op.ne]: 0 }
      } else if ('isNotified' in options) {
        opts.where.notifiedOn = options.isNotified ? { [Op.ne]: 0 } : 0
      }

      const familles = await ProjectModel.findAll({
        attributes: ['familleId'],
        group: ['familleId'],
        ...opts,
      })

      return familles.map((item) => item.get().familleId)
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log('Project.findExistingFamillesForAppelOffre error', error)
      return []
    }
  }

  async function findProjectsWithGarantiesFinancieresPendingBefore(
    beforeDate: number
  ): Promise<Array<Project>> {
    await _isDbReady
    try {
      const projectsRaw = (
        await ProjectModel.findAll({
          where: {
            garantiesFinancieresSubmittedOn: 0,
            garantiesFinancieresRelanceOn: 0,
            garantiesFinancieresDueOn: { [Op.ne]: 0, [Op.lte]: beforeDate },
            notifiedOn: { [Op.ne]: 0 },
            classe: 'Classé',
          },
        })
      ).map((item) => item.get())

      const deserializedItems = mapExceptError(
        projectsRaw,
        deserialize,
        'Project.findProjectsWithGarantiesFinancieresPendingBefore.deserialize error'
      )

      const projects = await Promise.all(
        deserializedItems.map(addAppelOffreToProject)
      )

      return projects
    } catch (error) {
      if (CONFIG.logDbErrors)
        console.log(
          'Project.findProjectsWithGarantiesFinancieresPendingBefore error',
          error
        )
      return []
    }
  }
}

export { makeProjectRepo }
