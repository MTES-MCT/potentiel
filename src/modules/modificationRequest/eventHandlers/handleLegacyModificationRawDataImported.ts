import { logger, errAsync, okAsync, WithDelay } from '../../../core/utils'
import { EventBus } from '../../eventStore'
import { FindProjectByIdentifiers } from '../../project'
import { EntityNotFoundError } from '../../shared'
import { LegacyModificationImported, LegacyModificationRawDataImported } from '../events'

export const handleLegacyModificationRawDataImported = (deps: {
  findProjectByIdentifiers: FindProjectByIdentifiers
  eventBus: EventBus
  withDelay: WithDelay
}) => async (event: LegacyModificationRawDataImported) => {
  const {
    payload: { appelOffreId, periodeId, familleId, numeroCRE, importId, modifications },
  } = event

  const { eventBus, findProjectByIdentifiers, withDelay } = deps

  const findProject = () =>
    findProjectByIdentifiers({ appelOffreId, periodeId, familleId, numeroCRE })

  findProject()
    .andThen(
      (projectIdOrNull): ReturnType<typeof findProject> => {
        if (projectIdOrNull !== null) return okAsync(projectIdOrNull)

        // findProject is a query on an eventually consistent database
        // the project id might not be available at the moment
        // try again later
        return withDelay(5000, () => findProject())
      }
    )
    .andThen((projectIdOrNull) => {
      if (projectIdOrNull !== null) {
        return eventBus.publish(
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
