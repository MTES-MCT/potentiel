import { wrapInfra } from '../../../../core/utils';
import { GetPendingCandidateInvitations } from '../../../../modules/notificationCandidats';
import { mapToOffsetAndLimit, makePaginatedList } from '../pagination';
import { Project, User } from '../../projectionsNext';
import { Pagination } from '../../../../modules/pagination';

export const getPendingCandidateInvitations: GetPendingCandidateInvitations = (
  pagination: Pagination,
) => {
  return wrapInfra(
    User.findAndCountAll({
      where: { registeredOn: null },
      include: [{ model: Project, as: 'candidateProjects', required: true }],
      ...mapToOffsetAndLimit(pagination),
    }),
  ).map(({ count, rows: pendingUsers }) =>
    makePaginatedList(
      pendingUsers.map(({ email, fullName, createdAt }) => ({
        email,
        fullName,
        invitedOn: createdAt.getTime(),
      })),
      count,
      pagination,
    ),
  );
};
