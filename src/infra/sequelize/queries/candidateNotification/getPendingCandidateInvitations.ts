import { wrapInfra } from '@core/utils';
import { GetPendingCandidateInvitations } from '@modules/notificationCandidats';
import { paginate, makePaginatedList } from '../../../../helpers/paginate';
import { Pagination } from '../../../../types';
import { Project, User } from '@infra/sequelize/projectionsNext';

export const getPendingCandidateInvitations: GetPendingCandidateInvitations = (
  pagination: Pagination,
) => {
  return wrapInfra(
    User.findAndCountAll({
      where: { registeredOn: null },
      include: [{ model: Project, as: 'candidateProjects', required: true }],
      ...paginate(pagination),
    }),
  ).map(({ count, rows: pendingUsers }) =>
    makePaginatedList(
      pendingUsers.map(({ email, fullName, createdAt }) => ({
        email,
        fullName,
        invitedOn: createdAt,
      })),
      count,
      pagination,
    ),
  );
};
