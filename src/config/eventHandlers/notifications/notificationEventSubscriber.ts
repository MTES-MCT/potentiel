import { err, logger, ok, Result } from '@core/utils'
import { Constructor, DomainEvent, HasType } from '@core/domain'
import { subscribeToRedis } from '@config/eventBus.config'

class NotificationError extends Error {
  constructor(public événement: DomainEvent) {
    super('Une erreur est survenue lors de la notification')
  }
}

type EventHandler<TEvent> = (event: TEvent) => Promise<void>

const handlersByType: Record<string, EventHandler<DomainEvent>> = {}

const handleEvent = async (event: DomainEvent) => {
  const { type } = event
  if (handlersByType[type]) {
    try {
      await handlersByType[type](event)
    } catch (error) {
      logger.error(new NotificationError(event))
    }
  }
}

export const notificationEventSubscriber = <Event extends DomainEvent>(
  eventClass: HasType,
  handler: EventHandler<Event>
): Result<null, Error> => {
  const type = eventClass.type

  if (handlersByType[type]) {
    return err(Error(`The event ${type} already has an handler for the Notifications`))
  }

  handlersByType[type] = handler
  return ok(null)
}

subscribeToRedis(handleEvent, 'Notification')
