import { errAsync } from 'neverthrow'
import { logger, ResultAsync } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { InvitationToProjectCancelled } from '../events'
import { GetProjectIdForAdmissionKey } from '../queries'

interface CancelInvitationToProjectDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  getProjectIdForAdmissionKey: GetProjectIdForAdmissionKey
  eventBus: EventBus
}

interface CancelInvitationToProjectArgs {
  projectAdmissionKeyId: string
  cancelledBy: User
}

export const makeCancelInvitationToProject = (deps: CancelInvitationToProjectDeps) => ({
  projectAdmissionKeyId,
  cancelledBy,
}: CancelInvitationToProjectArgs): ResultAsync<
  null,
  InfraNotAvailableError | UnauthorizedError
> => {
  return deps
    .getProjectIdForAdmissionKey(projectAdmissionKeyId)
    .andThen((projectId) => {
      return ResultAsync.fromPromise(
        deps.shouldUserAccessProject({ projectId, user: cancelledBy }),
        (e: Error) => {
          logger.error(e)
          return new InfraNotAvailableError()
        }
      )
    })
    .andThen((userHasRightsToProject) =>
      userHasRightsToProject
        ? deps.eventBus.publish(
            new InvitationToProjectCancelled({
              payload: {
                projectAdmissionKeyId,
                cancelledBy: cancelledBy.id,
              },
            })
          )
        : errAsync(new UnauthorizedError())
    )
}
