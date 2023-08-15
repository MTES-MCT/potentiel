import { ResultAsync } from '../../../core/utils';
import { AppelOffre, Famille, Periode, User } from '../../../entities';
import { PaginatedList, Pagination } from "../../pagination";
import { InfraNotAvailableError } from '../../shared';
import {
  ModificationRequestListItemDTO,
  ModificationRequestTypes,
  ModificationRequestStatusDTO,
} from '../dtos';

type GetModificationRequestListForPorteurFilter = {
  user: User & { role: 'porteur-projet' };
  appelOffreId?: AppelOffre['id'];
  periodeId?: Periode['id'];
  familleId?: Famille['id'];
  pagination?: Pagination;
  recherche?: string;
  modificationRequestStatus?: ModificationRequestStatusDTO;
  modificationRequestType?: ModificationRequestTypes;
};

export type GetModificationRequestListForPorteur = (
  filter: GetModificationRequestListForPorteurFilter,
) => ResultAsync<PaginatedList<ModificationRequestListItemDTO>, InfraNotAvailableError>;
