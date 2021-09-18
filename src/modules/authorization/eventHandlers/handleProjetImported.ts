import { UserRightsToProjectGranted } from '..'
import { logger, okAsync } from '../../../core/utils'
import { EventBus } from '../../eventStore'
import { ProjectImported, ProjectReimported } from '../../project'
import { GetUserByEmail } from '../../users/queries'

export const handleProjectImported =
  (deps: { eventBus: EventBus; getUserByEmail: GetUserByEmail }) =>
  async (event: ProjectImported | ProjectReimported) => {
    const { projectId, data } = event.payload
    const { email } = data

    try {
      if (email && email.length) {
        await deps.getUserByEmail(email).andThen((userOrNull) => {
          if (!!userOrNull) {
            return deps.eventBus.publish(
              new UserRightsToProjectGranted({
                payload: {
                  userId: userOrNull.id,
                  projectId,
                  grantedBy: '',
                },
              })
            )
          }
          return okAsync(null)
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
