import { Attributes, col, DataTypes, literal, Op, where } from 'sequelize'
import { ContextSpecificProjectListFilter, ProjectFilters, ProjectRepo } from '..'
import { logger } from '@core/utils'
import {
  AppelOffre,
  DREAL,
  Famille,
  Periode,
  Project,
  User,
  cahiersDesChargesRéférences,
} from '@entities'
import { makePaginatedList, paginate } from '../../helpers/paginate'
import { mapExceptError } from '../../helpers/results'
import { Err, Ok, PaginatedList, Pagination, ResultAsync } from '../../types'
import CONFIG from '../config'
import isDbReady from './helpers/isDbReady'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre'
import { GarantiesFinancières } from '@infra/sequelize'
import { models } from '@infra/sequelize/models'

const { File } = models

const deserializeGarantiesFinancières = (
  gf: Attributes<GarantiesFinancières> & {
    fichier: any
    envoyéesParRef: User
    validéesParRef: User
  }
): Project['garantiesFinancières'] => {
  if (!gf) return
  return {
    id: gf.id,
    projetId: gf.projetId,
    statut: gf.statut,
    soumisesALaCandidature: gf.soumisesALaCandidature,
    dateConstitution: gf.dateConstitution ?? undefined,
    dateEchéance: gf.dateEchéance ?? undefined,
    dateEnvoi: gf.dateEnvoi ?? undefined,
    dateLimiteEnvoi: gf.dateLimiteEnvoi ?? undefined,
    fichier: gf.fichier ?? undefined,
    validéesLe: gf.validéesLe ?? undefined,
    validéesPar: gf.validéesParRef ? { fullName: gf.validéesParRef.fullName } : undefined,
    envoyéesPar: gf.envoyéesParRef ? { fullName: gf.envoyéesParRef.fullName } : undefined,
  }
}

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  actionnaire: item.actionnaire || '',
  territoireProjet: item.territoireProjet || undefined,
  garantiesFinancieresRelanceOn: item.garantiesFinancieresRelanceOn || 0,
  dcrFile: item.dcrFile || '',
  dcrFileId: item.dcrFileId || '',
  dcrDueOn: item.dcrDueOn || 0,
  certificateFileId: item.certificateFileId || '',
  numeroGestionnaire: item.numeroGestionnaire || '',
  garantiesFinancières: deserializeGarantiesFinancières(item.garantiesFinancières),
  dcrDate: item.dcr?.stepDate.getTime() || 0,
  dcrSubmittedOn: item.dcr?.submittedOn.getTime() || 0,
  dcrSubmittedBy: item.dcr?.submittedBy,
  dcrFileRef: item.dcr?.file,
  dcrNumeroDossier: item.dcr?.details.numeroDossier,
  completionDueOn: item.completionDueOn || 0,
  abandonedOn: item.abandonedOn || 0,
  potentielIdentifier: item.potentielIdentifier || '',
  technologie: item.technologie || '',
  actionnariat: item.actionnariat || '',
})

type MakeProjectRepoDeps = {
  sequelizeInstance: any
  getProjectAppelOffre: GetProjectAppelOffre
}
type MakeProjectRepo = (deps: MakeProjectRepoDeps) => ProjectRepo

export const makeProjectRepo: MakeProjectRepo = ({ sequelizeInstance, getProjectAppelOffre }) => {
  const UserModel = sequelizeInstance.model('user')

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
    puissanceInitiale: {
      type: DataTypes.DOUBLE,
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
    evaluationCarboneDeRéférence: {
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
    dcrDueOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    completionDueOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    abandonedOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    certificateFileId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    numeroGestionnaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cahierDesChargesActuel: {
      type: DataTypes.ENUM(...cahiersDesChargesRéférences),
      allowNull: false,
      defaultValue: 'initial',
    },
    potentielIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    technologie: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actionnariat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    soumisAuxGF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

  ProjectModel.belongsTo(FileModel, {
    foreignKey: 'certificateFileId',
    as: 'certificateFile',
  })

  const ProjectStep = sequelizeInstance.define(
    'project_step',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      stepDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fileId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      submittedOn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      submittedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      statusUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      statusUpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )

  ProjectStep.hasOne(FileModel, {
    foreignKey: 'id',
    sourceKey: 'fileId',
    as: 'file',
  })

  ProjectStep.hasOne(UserModel, {
    foreignKey: 'id',
    sourceKey: 'statusUpdatedBy',
    attributes: 'fullName',
  })

  ProjectModel.hasOne(ProjectStep, {
    as: 'ptf',
    foreignKey: 'projectId',
    scope: {
      [Op.and]: where(col('ptf.type'), Op.eq, 'ptf'),
    },
  })

  ProjectModel.hasOne(ProjectStep, {
    as: 'attestationDesignationProof',
    foreignKey: 'projectId',
    scope: {
      type: 'attestation-designation-proof',
    },
  })

  ProjectModel.hasOne(GarantiesFinancières, {
    as: 'garantiesFinancières',
    foreignKey: 'projetId',
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
    searchAllMissingOwner,
    countUnnotifiedProjects,
    findProjectsWithGarantiesFinancieresPendingBefore,
  })

  async function addAppelOffreToProject(project: Project): Promise<Project> {
    const projectAppelOffre = await getProjectAppelOffre({ ...project })

    return {
      ...project,
      ...(projectAppelOffre && {
        appelOffre: projectAppelOffre,
        famille: projectAppelOffre.famille,
      }),
    }
  }

  async function findById(id: Project['id']): Promise<Project | undefined> {
    await _isDbReady

    try {
      const projectInDb = await ProjectModel.findByPk(id, {
        include: [
          {
            model: GarantiesFinancières,
            as: 'garantiesFinancières',
            include: [
              { model: File, as: 'fichier' },
              { model: UserModel, as: 'envoyéesParRef' },
              { model: UserModel, as: 'validéesParRef' },
            ],
          },
          {
            model: ProjectStep,
            as: 'ptf',
            include: [{ model: FileModel, as: 'file' }],
          },
          {
            model: FileModel,
            as: 'certificateFile',
            attributes: ['id', 'filename'],
          },
        ],
      })
      if (!projectInDb) return

      const projectWithAppelOffre = await addAppelOffreToProject(
        deserialize(projectInDb.get({ plain: true }))
      )

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

      const projectWithAppelOffre = await addAppelOffreToProject(deserialize(projectInDb.get()))
      return projectWithAppelOffre
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
    }
  }

  function _makeSelectorsForQuery(query?: ProjectFilters) {
    const opts: any = { where: {} }

    opts.include = [
      {
        model: GarantiesFinancières,
        as: 'garantiesFinancières',
        include: [
          { model: File, as: 'fichier' },
          { model: UserModel, as: 'envoyéesParRef' },
          { model: UserModel, as: 'validéesParRef' },
        ],
      },
      {
        model: ProjectStep,
        as: 'ptf',
        include: [{ model: FileModel, as: 'file' }],
      },
      {
        model: ProjectStep,
        as: 'attestationDesignationProof',
        include: [{ model: FileModel, as: 'file' }],
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

      if ('isAbandoned' in query) {
        opts.where.abandonedOn = query.isAbandoned ? { [Op.ne]: 0 } : 0
      }

      if ('garantiesFinancieres' in query) {
        switch (query.garantiesFinancieres) {
          case 'submitted':
            opts.where['$garantiesFinancières.dateEnvoi$'] = { [Op.ne]: null }
            break
          case 'notSubmitted':
            opts.where['$garantiesFinancières.dateLimiteEnvoi$'] = { [Op.ne]: null }
            opts.where['$garantiesFinancières.dateEnvoi$'] = null
            break
          case 'pastDue':
            opts.where['$garantiesFinancières.dateLimiteEnvoi$'] = {
              [Op.lte]: new Date(),
              [Op.ne]: null,
            }
            opts.where['$garantiesFinancières.dateEnvoi$'] = null
            break
        }
      }

      if ('isClasse' in query) {
        opts.where.classe = query.isClasse ? 'Classé' : 'Eliminé'
      }

      if ('isClaimed' in query) {
        opts.where.id = {
          [query.isClaimed ? Op.in : Op.notIn]: literal(`(SELECT "projectId" FROM "UserProjects")`),
        }
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

    const userInstance = await UserModel.findByPk(userId)
    if (!userInstance) {
      if (CONFIG.logDbErrors) logger.error('Cannot find user to get projects from')

      return []
    }

    return (await userInstance.getProjects(_makeSelectorsForQuery(filters))).map(
      (item) => item.get().id
    )
  }

  async function _searchWithinGivenIds(terms: string, projectIds: Project['id'][]) {
    const projects = await ProjectModel.findAll({
      where: {
        id: { [Op.in]: projectIds },
        [Op.or]: { ...getFullTextSearchOptions(terms) },
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
    const formattedRegions = Array.isArray(regions) ? regions.join('|') : regions

    const projects = await ProjectModel.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: { ...getFullTextSearchOptions(terms) },
          },
          {
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

      opts.where[Op.or] = { ...getFullTextSearchOptions(terms) }

      return _findAndBuildProjectList(opts, pagination)
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error)
      return makePaginatedList([], 0, pagination)
    }
  }

  async function searchAllMissingOwner(
    userEmail: string,
    userId: string,
    terms?: string,
    filters?: ProjectFilters,
    pagination?: Pagination
  ): Promise<PaginatedList<Project>> {
    await _isDbReady
    try {
      const opts = _makeSelectorsForQuery(filters)

      opts.where.id = {
        [Op.and]: [
          { [Op.notIn]: literal(`(SELECT "projectId" FROM "UserProjects")`) },
          {
            [Op.notIn]: literal(
              `(SELECT "projectId" FROM "userProjectClaims" WHERE "userId" = '${userId}' and "failedAttempts" >= 3)`
            ),
          },
        ],
      }

      // Order by Projets pré-affectés then the rest ordered by nomProjet
      opts.order = [
        [literal(`CASE "project"."email" WHEN '${userEmail}' THEN 1 ELSE 2 END`)],
        ['nomProjet'],
      ]

      const customSearchedProjectsColumns = [
        'nomCandidat',
        'nomProjet',
        'regionProjet',
        'appelOffreId',
        'periodeId',
      ]

      if (terms)
        opts.where[Op.or] = { ...getFullTextSearchOptions(terms, customSearchedProjectsColumns) }

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
          include: [
            {
              model: ProjectStep,
              as: 'gf',
            },
          ],
          where: {
            garantiesFinancieresRelanceOn: 0,
            garantiesFinancieresDueOn: { [Op.ne]: 0, [Op.lte]: beforeDate },
            notifiedOn: { [Op.ne]: 0 },
            classe: 'Classé',
            $gf$: null, // With include, means "without a GF"
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

export const getFullTextSearchOptions = (
  terms: string,
  customSearchedProjectsColumns?: string[]
): object => {
  const defaultSearchedProjectsColumns = [
    'nomCandidat',
    'nomProjet',
    'nomRepresentantLegal',
    'email',
    'adresseProjet',
    'codePostalProjet',
    'communeProjet',
    'departementProjet',
    'regionProjet',
    'numeroCRE',
    'details.Nom et prénom du signataire du formulaire',
    'details.Nom et prénom du contact',
    'potentielIdentifier',
  ]

  const searchedProjectsColumns = customSearchedProjectsColumns || defaultSearchedProjectsColumns

  const formattedTerms = terms
    .split(' ')
    .filter((term) => term.trim() !== '')
    .map((term) => `%${term}%`)

  const options = searchedProjectsColumns.reduce((opts, col) => {
    return {
      ...opts,
      [col]: { [Op.iLike]: { [Op.any]: [...formattedTerms] } },
    }
  }, {})

  return options
}
