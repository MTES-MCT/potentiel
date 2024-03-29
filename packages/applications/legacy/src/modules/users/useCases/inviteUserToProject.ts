import { EventBus } from '../../../core/domain';
import { err, ok, okAsync, Result, ResultAsync, wrapInfra } from '../../../core/utils';
import { Project, User } from '../../../entities';
import { UserInvitedToProject } from '../../authZ';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { GetUserByEmail } from '../queries';
import { CreateUser } from './createUser';

interface InviteUserToProjectDeps {
  getUserByEmail: GetUserByEmail;
  shouldUserAccessProject: (args: { user: User; projectId: Project['id'] }) => Promise<boolean>;
  createUser: CreateUser;
  eventBus: EventBus;
}

interface InviteUserToProjectArgs {
  email: string;
  invitedBy: User;
  projectIds: string[];
}

export const makeInviteUserToProject =
  (deps: InviteUserToProjectDeps) =>
  (
    args: InviteUserToProjectArgs,
  ): ResultAsync<null, UnauthorizedError | InfraNotAvailableError> => {
    const { shouldUserAccessProject, getUserByEmail, createUser, eventBus } = deps;
    const { email, projectIds, invitedBy } = args;

    return wrapInfra(
      Promise.all(
        projectIds.map((projectId) => shouldUserAccessProject({ user: invitedBy, projectId })),
      ),
    )
      .andThen((hasRightsForProject): Result<null, UnauthorizedError> => {
        if (hasRightsForProject.some((right) => !right)) {
          return err(new UnauthorizedError());
        }

        return ok(null);
      })
      .andThen(() => getUserByEmail(email))
      .andThen((userOrNull): ResultAsync<string, InfraNotAvailableError> => {
        if (userOrNull === null) {
          return createUser({ role: 'porteur-projet', email }).map(({ id }) => id);
        }

        return okAsync(userOrNull.id);
      })
      .andThen((userId) =>
        eventBus.publish(
          new UserInvitedToProject({ payload: { userId, projectIds, invitedBy: invitedBy.id } }),
        ),
      )
      .map(() => null);
  };
