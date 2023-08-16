import { ResultAsync } from '../../../core/utils';
import { PaginatedList, Pagination } from '../../pagination';
import { InfraNotAvailableError } from '../../shared';

export type PendingCandidateInvitationDTO = {
  fullName: string;
  email: string;
  invitedOn: number;
};

export type GetPendingCandidateInvitations = (
  pagination: Pagination,
) => ResultAsync<PaginatedList<PendingCandidateInvitationDTO>, InfraNotAvailableError>;
