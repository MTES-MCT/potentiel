import { ResultAsync } from '../../../core/utils';
import { User } from '../../../entities';
import { PaginatedList, Pagination } from '../../pagination';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { InfraNotAvailableError } from '../../shared';
import {
  ModificationRequestListItemDTO,
  ModificationRequestTypes,
  ModificationRequestStatusDTO,
} from '../dtos';

type GetModificationRequestListForPorteurFilter = {
  user: User & { role: 'porteur-projet' };
  appelOffreId?: AppelOffre.AppelOffreReadModel['id'];
  periodeId?: AppelOffre.Periode['id'];
  familleId?: AppelOffre.Famille['id'];
  pagination?: Pagination;
  recherche?: string;
  modificationRequestStatus?: ModificationRequestStatusDTO;
  modificationRequestType?: ModificationRequestTypes;
};

export type GetModificationRequestListForPorteur = (
  filter: GetModificationRequestListForPorteurFilter,
) => ResultAsync<PaginatedList<ModificationRequestListItemDTO>, InfraNotAvailableError>;
