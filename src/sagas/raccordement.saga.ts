import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { RaccordementEvent } from '@potentiel/domain-usecases';
import { publishToEventBus } from '../config/eventBus.config';
import { transformerISOStringEnDate } from '../infra/helpers';
import {
  DateMiseEnServiceTransmise,
  DemandeComplèteRaccordementTransmise,
} from '../modules/project';

export type SubscriptionEvent = RaccordementEvent & Event;

export type Execute = Message<'EXECUTE_RACCORDEMENT_SAGA', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'DateMiseEnServiceTransmise-V1':
        return new Promise<void>((resolve) => {
          publishToEventBus(
            new DateMiseEnServiceTransmise({
              payload: {
                ...transformerISOStringEnDate(event.payload),
                streamId: event.stream_id,
              },
            }),
          ).map(() => {
            resolve();
          });
        });
      case 'DemandeComplèteDeRaccordementTransmise-V1':
        return new Promise<void>((resolve) => {
          publishToEventBus(
            new DemandeComplèteRaccordementTransmise({
              payload: {
                ...transformerISOStringEnDate(event.payload),
                streamId: event.stream_id,
              },
            }),
          ).map(() => {
            resolve();
          });
        });
    }
    return Promise.reject();
  };

  mediator.register('EXECUTE_RACCORDEMENT_SAGA', handler);
};
