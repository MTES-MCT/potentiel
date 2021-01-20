import { DataTypes, Op } from 'sequelize'
import { ContextSpecificProjectListFilter, ProjectFilters, ProjectRepo } from '../'
import { logger } from '../../core/utils'
import { AppelOffre, DREAL, Famille, makeProject, Periode, User, Project } from '../../entities'
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
  garantiesFinancieresFileId: item.garantiesFinancieresFileId || '',
  garantiesFinancieresDueOn: item.garantiesFinancieresDueOn || 0,
  garantiesFinancieresRelanceOn: item.garantiesFinancieresRelanceOn || 0,
  garantiesFinancieresSubmittedOn: item.garantiesFinancieresSubmittedOn || 0,
  garantiesFinancieresSubmittedBy: item.garantiesFinancieresSubmittedBy || '',
  dcrDate: item.dcrDate || 0,
  dcrFile: item.dcrFile || '',
  dcrFileId: item.dcrFileId || '',
  dcrDueOn: item.dcrDueOn || 0,
  dcrSubmittedOn: item.dcrSubmittedOn || 0,
  dcrSubmittedBy: item.dcrSubmittedBy || '',
  dcrNumeroDossier: item.dcrNumeroDossier || '',
  certificateFileId: item.certificateFileId || '',
})

export default function makeProjectRepo({ sequelizeInstance, appelOffreRepo }): ProjectRepo {
  const ProjectModel = sequelizeInstance.define('project', {
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
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    prixReference: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    evaluationCarbone: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    note: {
      type: DataTypes.DOUBLE,
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
      type: DataTypes.TEXT,
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
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresDueOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresRelanceOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresSubmittedOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresDate: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    garantiesFinancieresFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    garantiesFinancieresFileId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    garantiesFinancieresSubmittedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dcrDueOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    dcrSubmittedOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    dcrDate: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    dcrFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dcrFileId: {
      type: DataTypes.UUID,
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
    certificateFileId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  })

  const ProjectEventModel = sequelizeInstance.define('projectEvent', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    before: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('before')
        let parsedValue = {}
        try {
          if (rawValue) parsedValue = JSON.parse(rawValue)
        } catch (e) {
          logger.info('ProjectEventModel failed to parse before rawValue', rawValue)
          logger.error(e)
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
          logger.info('ProjectEventModel failed to parse after rawValue', rawValue)
          logger.error(e)
        }
        return parsedValue
      },
      set(value) {
        this.setDataValue('after', JSON.stringify(value))
      },
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
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
  ProjectModel.belongsTo(FileModel, {
    foreignKey: 'garantiesFinancieresFileId',
    as: 'garantiesFinancieresFileRef',
  })

  ProjectModel.belongsTo(FileModel, {
    foreignKey: 'dcrFileId',
    as: 'dcrFileRef',
  })

  ProjectModel.belongsTo(FileModel, {
    foreignKey: 'certificateFileId',
    as: 'certificateFile',
  })

  const _isDbReady = isDbReady({ sequelizeInstance })

  return Object.freeze({
    findById,
    findOne,
    findAll,
    save,
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

    const periode = project.appelOffre.periodes.find((periode) => periode.id === project.periodeId)

    if (periode) {
      project.appelOffre.periode = periode
    }

    const famille = project.appelOffre.familles.find((famille) => famille.id === project.familleId)
    if (famille) {
      project.famille = famille
    }

    return project
  }

  async function findById(id: Project['id'], includeHistory?: true): Promise<Project | undefined> {
    await _isDbReady

    try {
      const projectInDb = await ProjectModel.findByPk(id, {
        include: [
          {
            model: FileModel,
            as: 'garantiesFinancieresFileRef',
            attributes: ['id', 'filename'],
          },
          {
            model: FileModel,
            as: 'dcrFileRef',
            attributes: ['id', 'filename'],
          },
          {
            model: FileModel,
            as: 'certificateFile',
            attributes: ['id', 'filename'],
          },
        ],
      })
      if (!projectInDb) return

      const projectInstance = makeProject(deserialize(projectInDb.get({ plain: true })))

      if (projectInstance.is_err()) {
        throw projectInstance.unwrap_err()
      }

      const projectWithAppelOffre = await addAppelOffreToProject(projectInstance.unwrap())

      if (includeHistory) {
        projectWithAppelOffre.history = (await projectInDb.getProjectEvents()).map((item) =>
          item.get()
        )
      }

      return projectWithAppelOffre
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
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

      const projectWithAppelOffre = await addAppelOffreToProject(projectInstance.unwrap())
      return projectWithAppelOffre
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
    }
  }

  function _makeSelectorsForQuery(query?: ProjectFilters) {
    const opts: any = { where: {} }

    opts.include = [
      {
        model: FileModel,
        as: 'garantiesFinancieresFileRef',
        attributes: ['id', 'filename'],
      },
      {
        model: FileModel,
        as: 'dcrFileRef',
        attributes: ['id', 'filename'],
      },
      {
        model: FileModel,
        as: 'certificateFile',
        attributes: ['id', 'filename'],
      },
    ]

    if (query) {
      if ('isNotified' in query) {
        opts.where.notifiedOn = query.isNotified ? { [Op.ne]: 0 } : 0
      }

      if ('garantiesFinancieres' in query) {
        switch (query.garantiesFinancieres) {
          case 'submitted':
            opts.where.garantiesFinancieresSubmittedOn = { [Op.ne]: 0 }
            break
          case 'notSubmitted':
            opts.where.garantiesFinancieresDueOn = { [Op.ne]: 0 }
            opts.where.garantiesFinancieresSubmittedOn = 0
            break
          case 'pastDue':
            opts.where.garantiesFinancieresDueOn = {
              [Op.lte]: Date.now(),
              [Op.ne]: 0,
            }
            opts.where.garantiesFinancieresSubmittedOn = 0
            break
        }
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
      .map((item) => item.get({ plain: true }))
      // Double check the list of projects if filterFn is given
      .filter(filterFn || (() => true))

    if (projectsRaw.length !== rows.length) {
      logger.warning(
        'WARNING: searchForRegions had intermediate results that did not match region. Something must be wrong in the query.'
      )
    }

    const deserializedItems = mapExceptError(
      projectsRaw,
      deserialize,
      'Project._getProjectsWithIds.deserialize error'
    )

    const projects = await Promise.all(deserializedItems.map(addAppelOffreToProject))

    return makePaginatedList(projects, count, pagination)
  }

  async function _getProjectIdsForUser(
    userId: User['id'],
    filters?: ProjectFilters
  ): Promise<Project['id'][]> {
    await _isDbReady

    const UserModel = sequelizeInstance.model('user')
    const userInstance = await UserModel.findByPk(userId)
    if (!userInstance) {
      if (CONFIG.logDbErrors) logger.error('Cannot find user to get projects from')

      return []
    }

    return (await userInstance.getProjects(_makeSelectorsForQuery(filters))).map(
      (item) => item.get().id
    )
  }

  async function _searchWithinGivenIds(term: string, projectIds: Project['id'][]) {
    const termsFormatted = term
      .split(' ')
      .reduce((acc, currTerm) => `${acc} ${currTerm}:* |`, '')
      .slice(0, -1)

    const projects = await ProjectModel.findAll({
      where: {
        id: { [Op.in]: projectIds },
        [Op.any]: sequelizeInstance.literal(`_search @@ to_tsquery('simple', '${termsFormatted}')`),
      },
    })

    return projects.map(({ id }) => id)
  }

  async function _getProjectsWithIds(
    projectIds: Project['id'][],
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    const opts = {
      where: {
        id: projectIds,
      },
      include: [
        {
          model: FileModel,
          as: 'certificateFile',
          attributes: ['id', 'filename'],
        },
      ],
    }

    return _findAndBuildProjectList(opts, pagination, (project) => projectIds.includes(project.id))
  }

  async function searchForUser(
    userId: User['id'],
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const filteredUserProjectIds = await _getProjectIdsForUser(userId, filters)

      if (!filteredUserProjectIds.length) return makePaginatedList([], 0, pagination)

      const searchedUserProjectIds = await _searchWithinGivenIds(terms, filteredUserProjectIds)

      if (!searchedUserProjectIds.length) return makePaginatedList([], 0, pagination)

      return _getProjectsWithIds(searchedUserProjectIds, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
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
      const filteredUserProjectIds = await _getProjectIdsForUser(userId, filters)

      if (!filteredUserProjectIds.length) return makePaginatedList([], 0, pagination)

      return _getProjectsWithIds(filteredUserProjectIds, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function _searchWithinRegions(
    terms: string,
    regions: DREAL | DREAL[]
  ): Promise<Project['id'][]> {
    const termsFormatted = terms
      .split(' ')
      .reduce((acc, currTerm) => `${acc} ${currTerm}:* |`, '')
      .slice(0, -1)

    const formattedRegions = Array.isArray(regions) ? regions.join('|') : regions
    const projects = await ProjectModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.any]: sequelizeInstance.literal(
              `_search @@ to_tsquery('simple', '${termsFormatted}')`
            ),
            regionProjet: { [Op.iRegexp]: formattedRegions },
          },
        ],
      },
    })

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
      const searchedRegionProjectIds = await _searchWithinRegions(terms, regions)

      if (!searchedRegionProjectIds.length) return makePaginatedList([], 0, pagination)

      const opts = _makeSelectorsForQuery(filters)

      opts.where.id = searchedRegionProjectIds

      return _findAndBuildProjectList(opts, pagination, (project) =>
        project.regionProjet.split(' / ').some((region) => regions.includes(region as DREAL))
      )
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
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

      const res = await _findAndBuildProjectList(opts, pagination, (project) =>
        project.regionProjet.split(' / ').some((region) => regions.includes(region as DREAL))
      )
      return res
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function searchAll(
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const opts = _makeSelectorsForQuery(filters)

      const termsFormatted = terms
        .split(' ')
        .reduce((acc, currTerm) => `${acc} ${currTerm}:* |`, '')
        .slice(0, -1)
      opts.where[Op.any] = sequelizeInstance.literal(
        `_search @@ to_tsquery('simple', '${termsFormatted}')`
      )

      return _findAndBuildProjectList(opts, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
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
      if (CONFIG.logDbErrors) logger.error(error)
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
      if (CONFIG.logDbErrors) logger.error(error)
      return 0
    }
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
            .map((newEvent) => ProjectEventModel.create(newEvent))
        )
      } catch (error) {
        logger.error(error)
      }
    }
  }

  async function save(project: Project): ResultAsync<null> {
    await _isDbReady

    try {
      const existingProject = await ProjectModel.findByPk(project.id)

      if (existingProject) {
        const updates = project.history?.reduce(
          (delta, event) => ({ ...delta, ...event.after }),
          {}
        )
        if (updates) {
          await existingProject.update(updates)
        }
      } else {
        // TODO PA : est-ce qu'on garde cette partie telle quelle ou on l'améliore ?
        ;[
          'garantiesFinancieresFileId',
          'garantiesFinancieresSubmittedBy',
          'dcrFileId',
          'dcrSubmittedBy',
          'certificateFileId',
        ].forEach((key) => {
          // If that property is falsy, remove it (UUIDs can't be falsy)
          if (!project[key]) delete project[key]
        })
        await ProjectModel.create(project)
      }

      await _updateProjectHistory(project)

      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return Err(error)
    }
  }

  async function remove(id: Project['id']): ResultAsync<null> {
    await _isDbReady

    try {
      await ProjectModel.destroy({ where: { id } })
      return Ok(null)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
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
      if (CONFIG.logDbErrors) logger.error(error)
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
      if (CONFIG.logDbErrors) logger.error(error)
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
      if (CONFIG.logDbErrors) logger.error(error)
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

      const projects = await Promise.all(deserializedItems.map(addAppelOffreToProject))

      return projects
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return []
    }
  }
}

export { makeProjectRepo }
