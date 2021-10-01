import { logger, errAsync } from '../../../core/utils'
import { EventBus } from '../../eventStore'
import { FindProjectByIdentifiers } from '../../project'
import { EntityNotFoundError } from '../../shared'
import { LegacyModificationImported, LegacyModificationRawDataImported } from '../events'

export const handleLegacyModificationRawDataImported =
  (deps: { findProjectByIdentifiers: FindProjectByIdentifiers; eventBus: EventBus }) =>
  async (event: LegacyModificationRawDataImported) => {
    const {
      payload: { appelOffreId, periodeId, familleId, numeroCRE, importId, modifications },
    } = event

    await deps
      .findProjectByIdentifiers({ appelOffreId, periodeId, familleId, numeroCRE })
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
