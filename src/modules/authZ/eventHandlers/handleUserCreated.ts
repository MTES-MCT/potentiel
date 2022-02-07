import { EventBus } from '@core/domain'
import { logger, okAsync } from '@core/utils'
import { GetNonLegacyProjectsByContactEmail } from '../../project'
import { UserCreated } from '../../users'
import { UserProjectsLinkedByContactEmail } from '../events'

interface HandleUserCreatedDeps {
  getNonLegacyProjectsByContactEmail: GetNonLegacyProjectsByContactEmail
  eventBus: EventBus
}

export const handleUserCreated = (deps: HandleUserCreatedDeps) => async (event: UserCreated) => {
  const { userId, email } = event.payload
  const { getNonLegacyProjectsByContactEmail, eventBus } = deps

  try {
    const res = await getNonLegacyProjectsByContactEmail(email).andThen((projectIds) =>
      projectIds.length
        ? eventBus.publish(
            new UserProjectsLinkedByContactEmail({
              payload: { userId, projectIds },
            })
          )
        : okAsync(null)
    )
    if (res.isErr()) {
      throw res.error
    }
  } catch (error) {
    logger.error(error)
  }
}
