import { errAsync } from 'neverthrow'
import { ResultAsync, wrapInfra } from '../../../core/utils'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../shared'
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
  InfraNotAvailableError | UnauthorizedError | EntityNotFoundError
> => {
  return deps
    .getProjectIdForAdmissionKey(projectAdmissionKeyId)
    .andThen((projectId) => {
      return wrapInfra(deps.shouldUserAccessProject({ projectId, user: cancelledBy }))
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
