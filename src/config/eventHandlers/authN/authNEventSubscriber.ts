import { err, logger, ok, Result } from '@core/utils';
import { DomainEvent, HasType } from '@core/domain';
import { subscribeToRedis } from '@config/eventBus.config';

class AuthNError extends Error {
  constructor(public événement: DomainEvent, public erreur: Error) {
    super(`Une erreur est survenue lors du traitement de l'évènement pour authN`);
  }
}

type EventHandler<TEvent> = (event: TEvent) => Promise<void>;

const handlersByType: Record<string, EventHandler<DomainEvent>> = {};

const handleEvent = async (event: DomainEvent) => {
  const { type } = event;
  if (handlersByType[type]) {
    try {
      await handlersByType[type](event);
    } catch (error) {
      logger.error(new AuthNError(event, error));
    }
  }
};

export const authNEventSubscriber = <Event extends DomainEvent>(
  eventClass: HasType,
  handler: EventHandler<Event>,
): Result<null, Error> => {
  const type = eventClass.type;

  if (handlersByType[type]) {
    return err(Error(`The event ${type} already has an handler for the AuthN`));
  }

  handlersByType[type] = handler;
  return ok(null);
};

subscribeToRedis(handleEvent, 'AuthN');
