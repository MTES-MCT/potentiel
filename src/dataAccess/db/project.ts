import { Attributes, literal, Op } from 'sequelize';
import { ContextSpecificProjectListFilter, ProjectFilters, ProjectRepo } from '..';
import { logger } from '@core/utils';
import { AppelOffre, Famille, Periode, Project, User } from '@entities';
import { makePaginatedList, paginate } from '../../helpers/paginate';
import { mapExceptError } from '../../helpers/results';
import { Err, Ok, PaginatedList, Pagination, ResultAsync } from '../../types';
import CONFIG from '../config';
import isDbReady from './helpers/isDbReady';
import { GetProjectAppelOffre } from '@modules/projectAppelOffre';
import { GarantiesFinancières } from '@infra/sequelize';
import { Région } from '@modules/dreal/région';
import {
  User as UserModel,
  UserProjects,
  File as FileModel,
  Project as ProjectModel,
} from '@infra/sequelize/projectionsNext';

const deserializeGarantiesFinancières = (
  gf: Attributes<GarantiesFinancières> & {
    fichier: any;
    envoyéesParRef: User;
    validéesParRef: User;
  },
): Project['garantiesFinancières'] => {
  if (!gf) return;
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
  };
};

// Override these to apply serialization/deserialization on inputs/outputs
const deserialize = (item) => ({
  ...item,
  actionnaire: item.actionnaire || '',
  territoireProjet: item.territoireProjet || undefined,
  dcrFile: item.dcrFile || '',
  dcrFileId: item.dcrFileId || '',
  dcrDueOn: item.dcrDueOn || 0,
  certificateFileId: item.certificateFileId || '',
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
});

type MakeProjectRepoDeps = {
  sequelizeInstance: any;
  getProjectAppelOffre: GetProjectAppelOffre;
};
type MakeProjectRepo = (deps: MakeProjectRepoDeps) => ProjectRepo;

/**
 * @deprecated
 */
export const makeProjectRepo: MakeProjectRepo = ({ sequelizeInstance, getProjectAppelOffre }) => {
  const _isDbReady = isDbReady({ sequelizeInstance });

  return Object.freeze({
    findById,
    findOne,
    findAll,
    save,
    remove,
    findExistingAppelsOffres,
    findExistingFamillesForAppelOffre,
    findExistingPeriodesForAppelOffre,
    searchForRegions,
    findAllForRegions,
    searchAll,
    searchAllMissingOwner,
  });

  async function addAppelOffreToProject(project: Project): Promise<Project> {
    const projectAppelOffre = await getProjectAppelOffre({ ...project });

    return {
      ...project,
      ...(projectAppelOffre && {
        appelOffre: projectAppelOffre,
        famille: projectAppelOffre.famille,
      }),
    };
  }

  async function findById(id: Project['id']): Promise<Project | undefined> {
    await _isDbReady;

    try {
      const projectInDb = await ProjectModel.findByPk(id, {
        include: [
          {
            model: GarantiesFinancières,
            as: 'garantiesFinancières',
            include: [
              { model: FileModel, as: 'fichier' },
              { model: UserModel, as: 'envoyéesParRef' },
              { model: UserModel, as: 'validéesParRef' },
            ],
          },
          {
            model: FileModel,
            as: 'certificateFile',
            attributes: ['id', 'filename'],
          },
        ],
      });
      if (!projectInDb) return;

      const projectWithAppelOffre = await addAppelOffreToProject(
        deserialize(projectInDb.get({ plain: true })),
      );

      return projectWithAppelOffre;
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
    }
  }

  async function findOne(query: ProjectFilters): Promise<Project | undefined> {
    await _isDbReady;

    try {
      const projectInDb = await ProjectModel.findOne({
        where: _makeSelectorsForQuery(query),
      });

      if (!projectInDb) return;

      const projectWithAppelOffre = await addAppelOffreToProject(deserialize(projectInDb.get()));
      return projectWithAppelOffre;
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
    }
  }

  function _makeSelectorsForQuery(query?: ProjectFilters) {
    const opts: any = { where: {} };

    opts.include = [
      {
        model: GarantiesFinancières,
        as: 'garantiesFinancières',
        include: [
          { model: FileModel, as: 'fichier' },
          { model: UserModel, as: 'envoyéesParRef' },
          { model: UserModel, as: 'validéesParRef' },
        ],
      },
      {
        model: FileModel,
        as: 'certificateFile',
        attributes: ['id', 'filename'],
      },
    ];

    if (query) {
      if ('isNotified' in query) {
        opts.where.notifiedOn = query.isNotified ? { [Op.ne]: 0 } : 0;
      }

      if ('isAbandoned' in query) {
        opts.where.abandonedOn = query.isAbandoned ? { [Op.ne]: 0 } : 0;
      }

      if ('garantiesFinancieres' in query) {
        switch (query.garantiesFinancieres) {
          case 'submitted':
            opts.where['$garantiesFinancières.dateEnvoi$'] = { [Op.ne]: null };
            break;
          case 'notSubmitted':
            opts.where['$garantiesFinancières.dateLimiteEnvoi$'] = { [Op.ne]: null };
            opts.where['$garantiesFinancières.dateEnvoi$'] = null;
            break;
          case 'pastDue':
            opts.where['$garantiesFinancières.dateLimiteEnvoi$'] = {
              [Op.lte]: new Date(),
              [Op.ne]: null,
            };
            opts.where['$garantiesFinancières.dateEnvoi$'] = null;
            break;
        }
      }

      if ('isClasse' in query) {
        opts.where.classe = query.isClasse ? 'Classé' : 'Eliminé';
      }

      if ('isClaimed' in query) {
        opts.where.id = {
          [query.isClaimed ? Op.in : Op.notIn]: literal(`(SELECT "projectId" FROM "UserProjects")`),
        };
      }

      if ('appelOffreId' in query) {
        opts.where.appelOffreId = query.appelOffreId;
      }

      if ('periodeId' in query) {
        opts.where.periodeId = query.periodeId;
      }

      if ('familleId' in query) {
        opts.where.familleId = query.familleId;
      }

      if ('email' in query) {
        opts.where.email = query.email;
      }

      if ('nomProjet' in query) {
        opts.where.nomProjet = query.nomProjet;
      }
    }

    return opts;
  }

  async function _findAndBuildProjectList(
    opts: Record<any, any>,
    pagination?: Pagination,
    filterFn?: (project: Project) => boolean,
  ): Promise<PaginatedList<Project>> {
    const { count, rows } = await ProjectModel.findAndCountAll({
      ...opts,
      ...paginate(pagination),
    });

    const projectsRaw = rows
      .map((item) => item.get({ plain: true }))
      // Double check the list of projects if filterFn is given
      .filter((filterFn as any) || (() => true));

    if (projectsRaw.length !== rows.length) {
      logger.warning(
        'WARNING: searchForRegions had intermediate results that did not match region. Something must be wrong in the query.',
      );
    }

    const deserializedItems = mapExceptError(
      projectsRaw,
      deserialize,
      'Project._getProjectsWithIds.deserialize error',
    );

    const projects = await Promise.all(deserializedItems.map(addAppelOffreToProject));

    return makePaginatedList(projects, count, pagination);
  }

  async function _getProjectIdsForUser(userId: User['id']): Promise<Project['id'][]> {
    await _isDbReady;

    const userProjects = await UserProjects.findAll({ where: { userId } });

    return userProjects.map((userProject) => userProject.projectId);
  }

  async function _searchWithinRegions(
    terms: string,
    regions: Région | Région[],
  ): Promise<Project['id'][]> {
    const formattedRegions = Array.isArray(regions) ? regions.join('|') : regions;

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
    });

    return projects.map((item) => item.id);
  }

  async function searchForRegions(
    regions: Région | Région[],
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>> {
    await _isDbReady;
    try {
      const searchedRegionProjectIds = await _searchWithinRegions(terms, regions);

      if (!searchedRegionProjectIds.length) return makePaginatedList([], 0, pagination);

      const opts = _makeSelectorsForQuery(filters);

      opts.where.id = searchedRegionProjectIds;

      return _findAndBuildProjectList(opts, pagination, (project) =>
        project.regionProjet.split(' / ').some((region) => regions.includes(region as Région)),
      );
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return makePaginatedList([], 0, pagination);
    }
  }

  function _makeRegionSelector(regions: Région | Région[]) {
    // Region can be of shape 'region1 / region2' so simple equality does not work
    if (Array.isArray(regions) && regions.length) {
      return {
        [Op.or]: regions.map((region) => ({
          [Op.substring]: region,
        })),
      };
    } else {
      return {
        [Op.substring]: regions,
      };
    }
  }

  async function findAllForRegions(
    regions: Région | Région[],
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>> {
    await _isDbReady;
    try {
      const opts = _makeSelectorsForQuery(filters);

      opts.where.regionProjet = _makeRegionSelector(regions);

      const res = await _findAndBuildProjectList(opts, pagination, (project) =>
        project.regionProjet.split(' / ').some((region) => regions.includes(region as Région)),
      );
      return res;
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return makePaginatedList([], 0, pagination);
    }
  }

  async function searchAll(
    terms: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>> {
    await _isDbReady;
    try {
      const opts = _makeSelectorsForQuery(filters);

      opts.where[Op.or] = { ...getFullTextSearchOptions(terms) };

      return _findAndBuildProjectList(opts, pagination);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return makePaginatedList([], 0, pagination);
    }
  }

  async function searchAllMissingOwner(
    userEmail: string,
    userId: string,
    terms?: string,
    filters?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>> {
    await _isDbReady;
    try {
      const opts = _makeSelectorsForQuery(filters);

      opts.where.id = {
        [Op.and]: [
          { [Op.notIn]: literal(`(SELECT "projectId" FROM "UserProjects")`) },
          {
            [Op.notIn]: literal(
              `(SELECT "projectId" FROM "userProjectClaims" WHERE "userId" = '${userId}' and "failedAttempts" >= 3)`,
            ),
          },
        ],
      };

      // Order by Projets pré-affectés then the rest ordered by nomProjet
      opts.order = [
        [literal(`CASE "Project"."email" WHEN '${userEmail}' THEN 1 ELSE 2 END`)],
        ['nomProjet'],
      ];

      const customSearchedProjectsColumns = [
        'nomCandidat',
        'nomProjet',
        'regionProjet',
        'appelOffreId',
        'periodeId',
      ];

      if (terms)
        opts.where[Op.or] = { ...getFullTextSearchOptions(terms, customSearchedProjectsColumns) };

      return _findAndBuildProjectList(opts, pagination);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return makePaginatedList([], 0, pagination);
    }
  }

  async function findAll(
    query?: ProjectFilters,
    pagination?: Pagination,
  ): Promise<PaginatedList<Project>> {
    await _isDbReady;
    try {
      const opts = _makeSelectorsForQuery(query);

      return _findAndBuildProjectList(opts, pagination);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return makePaginatedList([], 0, pagination);
    }
  }

  /**
   * @deprecated
   */
  async function save(project: Project): ResultAsync<null> {
    await _isDbReady;

    try {
      const existingProject = await ProjectModel.findByPk(project.id);

      if (existingProject) {
        const updates = project.history?.reduce(
          (delta, event) => ({ ...delta, ...event.after }),
          {},
        );
        if (updates) {
          await existingProject.update(updates);
        }
      } else {
        // TODO PA : est-ce qu'on garde cette partie telle quelle ou on l'améliore ?
        ['dcrFileId', 'dcrSubmittedBy', 'certificateFileId'].forEach((key) => {
          // If that property is falsy, remove it (UUIDs can't be falsy)
          if (!project[key]) delete project[key];
        });
        await ProjectModel.create(project as any);
      }

      return Ok(null);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function remove(id: Project['id']): ResultAsync<null> {
    await _isDbReady;

    try {
      await ProjectModel.destroy({ where: { id } });
      return Ok(null);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return Err(error);
    }
  }

  async function findExistingAppelsOffres(
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<AppelOffre['id']>> {
    await _isDbReady;

    try {
      const opts: any = { where: {} };

      if (!options) {
      } else if ('userId' in options) {
        opts.where.id = await _getProjectIdsForUser(options.userId);
        opts.where.notifiedOn = { [Op.ne]: 0 };
      } else if ('regions' in options) {
        opts.where.regionProjet = _makeRegionSelector(options.regions);
        opts.where.notifiedOn = { [Op.ne]: 0 };
      } else if ('isNotified' in options) {
        opts.where.notifiedOn = options.isNotified ? { [Op.ne]: 0 } : 0;
      }

      const appelsOffres = await ProjectModel.findAll({
        attributes: ['appelOffreId'],
        group: ['appelOffreId'],
        ...opts,
      });

      return appelsOffres.map((item) => item.get().appelOffreId);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return [];
    }
  }

  async function findExistingPeriodesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<Periode['id']>> {
    await _isDbReady;

    try {
      const opts: any = { where: { appelOffreId } };

      if (!options) {
      } else if ('userId' in options) {
        opts.where.id = await _getProjectIdsForUser(options.userId);
        opts.where.notifiedOn = { [Op.ne]: 0 };
      } else if ('regions' in options) {
        opts.where.regionProjet = _makeRegionSelector(options.regions);
        opts.where.notifiedOn = { [Op.ne]: 0 };
      } else if ('isNotified' in options) {
        opts.where.notifiedOn = options.isNotified ? { [Op.ne]: 0 } : 0;
      }

      const periodes = await ProjectModel.findAll({
        attributes: ['periodeId'],
        group: ['periodeId'],
        ...opts,
      });

      return periodes.map((item) => item.get().periodeId);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return [];
    }
  }

  async function findExistingFamillesForAppelOffre(
    appelOffreId: AppelOffre['id'],
    options?: ContextSpecificProjectListFilter,
  ): Promise<Array<Famille['id']>> {
    await _isDbReady;

    try {
      const opts: any = { where: { appelOffreId } };

      if (!options) {
      } else if ('userId' in options) {
        opts.where.id = await _getProjectIdsForUser(options.userId);
        opts.where.notifiedOn = { [Op.ne]: 0 };
      } else if ('regions' in options) {
        opts.where.regionProjet = _makeRegionSelector(options.regions);
        opts.where.notifiedOn = { [Op.ne]: 0 };
      } else if ('isNotified' in options) {
        opts.where.notifiedOn = options.isNotified ? { [Op.ne]: 0 } : 0;
      }

      const familles = await ProjectModel.findAll({
        attributes: ['familleId'],
        group: ['familleId'],
        ...opts,
      });

      return familles.map((item) => item.get().familleId);
    } catch (error) {
      if (CONFIG.logDbErrors) logger.error(error);
      return [];
    }
  }
};

export const getFullTextSearchOptions = (
  terms: string,
  customSearchedProjectsColumns?: string[],
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
  ];

  const searchedProjectsColumns = customSearchedProjectsColumns || defaultSearchedProjectsColumns;

  const formattedTerms = terms
    .split(' ')
    .filter((term) => term.trim() !== '')
    .map((term) => `%${term}%`);

  const options = searchedProjectsColumns.reduce((opts, col) => {
    return {
      ...opts,
      [col]: { [Op.iLike]: { [Op.any]: [...formattedTerms] } },
    };
  }, {});

  return options;
};
