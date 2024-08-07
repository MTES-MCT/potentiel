import { Project, User } from '../entities';
import { ProjectRepo, ProjectFilters } from '../dataAccess';
import { PaginatedList, Pagination } from '../modules/pagination';
import { AppelOffre } from '@potentiel-domain/appel-offre';

interface MakeUseCaseProps {
  searchAllMissingOwner: ProjectRepo['searchAllMissingOwner'];
  findExistingAppelsOffres: ProjectRepo['findExistingAppelsOffres'];
  findExistingPeriodesForAppelOffre: ProjectRepo['findExistingPeriodesForAppelOffre'];
  findExistingFamillesForAppelOffre: ProjectRepo['findExistingFamillesForAppelOffre'];
}

interface ListMissingOwnerProjectsDeps {
  user: User;
  appelOffreId?: AppelOffre.AppelOffreReadModel['id'];
  periodeId?: AppelOffre.Periode['id'];
  familleId?: AppelOffre.Famille['id'];
  pagination?: Pagination;
  recherche?: string;
  classement?: 'classés' | 'éliminés' | 'abandons';
  garantiesFinancieres?: 'submitted' | 'notSubmitted' | 'pastDue';
}

interface ListMissingOwnerProjectsResult {
  projects: PaginatedList<Project>;
  existingAppelsOffres: Array<AppelOffre.AppelOffreReadModel['id']>;
  existingPeriodes?: Array<AppelOffre.Periode['id']>;
  existingFamilles?: Array<AppelOffre.Famille['id']>;
}

export default function makeListMissingOwnerProjects({
  searchAllMissingOwner,
  findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre,
}: MakeUseCaseProps) {
  return async function listMissingOwnerProjects({
    user,
    appelOffreId,
    periodeId,
    familleId,
    pagination,
    recherche,
  }: ListMissingOwnerProjectsDeps): Promise<ListMissingOwnerProjectsResult> {
    const query: ProjectFilters = {
      isNotified: true,
    };

    if (appelOffreId) {
      query.appelOffreId = appelOffreId;

      if (periodeId) {
        query.periodeId = periodeId;
      }

      if (familleId) {
        query.familleId = familleId;
      }
    }

    const result: any = {};

    const projects = await searchAllMissingOwner(user.email, user.id, recherche, query, pagination);

    result.projects = projects;

    result.existingAppelsOffres = await findExistingAppelsOffres();

    if (appelOffreId) {
      result.existingPeriodes = await findExistingPeriodesForAppelOffre(appelOffreId);
      result.existingFamilles = await findExistingFamillesForAppelOffre(appelOffreId);
    }

    return result as ListMissingOwnerProjectsResult;
  };
}
