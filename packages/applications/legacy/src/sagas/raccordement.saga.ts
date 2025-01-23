import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { publishToEventBus } from '../config/eventBus.config';
import { transformerISOStringEnDate } from '../infra/helpers';
import {
  DateMiseEnServiceTransmise,
  DemandeComplèteRaccordementTransmise,
} from '../modules/project';
import { Raccordement } from '@potentiel-domain/laureat';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type SubscriptionEvent = (
  | Raccordement.DateMiseEnServiceTransmiseEvent
  | Raccordement.DateMiseEnServiceTransmiseV1Event
  | Raccordement.DemandeComplèteRaccordementTransmiseEvent
) &
  Event;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type Execute = Message<'System.Saga.Raccordement', SubscriptionEvent>;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'DateMiseEnServiceTransmise-V1':
      case 'DateMiseEnServiceTransmise-V2':
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
      case 'DemandeComplèteDeRaccordementTransmise-V2':
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

  mediator.register('System.Saga.Raccordement', handler);
};
