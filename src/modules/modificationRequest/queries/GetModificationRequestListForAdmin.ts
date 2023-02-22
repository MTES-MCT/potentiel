import { ResultAsync } from '@core/utils';
import { AppelOffre, Famille, Periode, User } from '@entities';
import { PaginatedList, Pagination } from '../../../types';
import { InfraNotAvailableError } from '../../shared';
import {
  ModificationRequestListItemDTO,
  ModificationRequestTypes,
  ModificationRequestStatusDTO,
} from '../dtos';

export const PermissionListerDemandesAdmin = {
  nom: 'lister-demandes',
  description: 'Lister les demandes de modification',
};

type GetModificationRequestListForAdminFilter = {
  user: User & { role: 'dreal' | 'dgec-validateur' | 'admin' };
  appelOffreId?: AppelOffre['id'];
  periodeId?: Periode['id'];
  familleId?: Famille['id'];
  pagination?: Pagination;
  recherche?: string;
  modificationRequestStatus?: ModificationRequestStatusDTO;
  modificationRequestType?: ModificationRequestTypes;
  forceNoAuthority?: true;
};

export type GetModificationRequestListForAdmin = (
  filter: GetModificationRequestListForAdminFilter,
) => ResultAsync<PaginatedList<ModificationRequestListItemDTO>, InfraNotAvailableError>;
