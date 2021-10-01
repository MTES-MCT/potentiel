import { UserRightsToProjectGranted } from '..'
import { logger, okAsync } from '../../../core/utils'
import { EventBus } from '../../eventStore'
import { ProjectImported, ProjectReimported } from '../../project'
import { GetUserByEmail } from '../../users/queries'

interface HandleProjectImportedDeps {
  eventBus: EventBus
  getUserByEmail: GetUserByEmail
  isPeriodeLegacy: (args: { appelOffreId: string; periodeId: string }) => Promise<boolean>
}

export const handleProjectImported =
  (deps: HandleProjectImportedDeps) => async (event: ProjectImported | ProjectReimported) => {
    const { projectId, data, appelOffreId, periodeId } = event.payload
    const { email } = data

    try {
      const isLegacy = await deps.isPeriodeLegacy({ appelOffreId, periodeId })

      if (isLegacy) return

      if (email?.length) {
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
