import { err, logger, ok, Result, ResultAsync } from '@core/utils'
import { DomainEvent, HasType } from '@core/domain'
import { subscribeToRedis } from '@config/eventBus.config'

class TachesImportError extends Error {
  constructor(public événement: DomainEvent, public erreur: Error) {
    super(`Une erreur est survenue lors du traitement de la tâche d'import`)
  }
}

type EventHandler<TEvent> = (event: TEvent) => ResultAsync<null, Error>

const handlersByType: Record<string, EventHandler<DomainEvent>> = {}

const handleEvent = async (event: DomainEvent) => {
  const { type } = event
  if (handlersByType[type]) {
    const result = await handlersByType[type](event)

    if (result.isErr()) {
      logger.error(new TachesImportError(event, result.error))
    }
  }
}

export const tacheImportEventSubscriber = <Event extends DomainEvent>(
  eventClass: HasType,
  handler: EventHandler<Event>
): Result<null, Error> => {
  const type = eventClass.type

  if (handlersByType[type]) {
    return err(Error(`The event ${type} already has an handler for the TachesImport`))
  }

  handlersByType[type] = handler
  return ok(null)
}

subscribeToRedis(handleEvent, 'TachesImport')
