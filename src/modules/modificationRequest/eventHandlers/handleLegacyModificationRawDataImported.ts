import { logger, errAsync, okAsync } from '../../../core/utils'
import { withDelay } from '../../../core/utils/withDelay'
import { EventBus } from '../../eventStore'
import { FindProjectByIdentifiers } from '../../project'
import { EntityNotFoundError } from '../../shared'
import { LegacyModificationImported, LegacyModificationRawDataImported } from '../events'

export const handleLegacyModificationRawDataImported = (deps: {
  findProjectByIdentifiers: FindProjectByIdentifiers
  eventBus: EventBus
}) => async (event: LegacyModificationRawDataImported) => {
  const {
    payload: { appelOffreId, periodeId, familleId, numeroCRE, importId, modifications },
  } = event

  const findProject = () =>
    deps.findProjectByIdentifiers({ appelOffreId, periodeId, familleId, numeroCRE })

  findProject()
    .andThen(
      (projectIdOrNull): ReturnType<typeof findProject> => {
        if (projectIdOrNull !== null) return okAsync(projectIdOrNull)

        return withDelay(5000, () => findProject())
      }
    )
    .andThen((projectIdOrNull) => {
      if (projectIdOrNull !== null) {
        return deps.eventBus.publish(
          new LegacyModificationImported({
            payload: {
              projectId: projectIdOrNull,
              modifications,
              importId,
            },
          })
        )
      }

      return errAsync(new EntityNotFoundError())
    })
    .match(
      () => {},
      (e: Error) => {
        logger.error(e)
      }
    )
}
