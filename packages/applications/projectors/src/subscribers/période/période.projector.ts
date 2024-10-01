import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Période } from '@potentiel-domain/periode';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../infrastructure/upsertProjection';
import { removeProjection } from '../../infrastructure/removeProjection';

export type SubscriptionEvent = (Période.PériodeNotifiéeEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Periode', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Période.PériodeEntity>(`période|${payload.id}`);
    } else {
      switch (type) {
        case 'PériodeNotifiée-V1':
          const périodeToUpsert = await getPériodeToUpsert(payload.identifiantPériode);

          await upsertProjection<Période.PériodeEntity>(`période|${payload.identifiantPériode}`, {
            ...payload,
            estNotifiée: true,
            notifiéeLe: périodeToUpsert.notifiéeLe ?? payload.notifiéeLe,
            notifiéePar: périodeToUpsert.notifiéePar ?? payload.notifiéePar,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Periode', handler);
};

const getPériodeToUpsert = async (
  identifiantPériode: Période.IdentifiantPériode.RawType,
): Promise<Omit<Période.PériodeEntity, 'type'>> => {
  const période = await findProjection<Période.PériodeEntity>(`période|${identifiantPériode}`);

  return Option.isSome(période)
    ? période
    : {
        identifiantPériode,
        appelOffre: Période.IdentifiantPériode.convertirEnValueType(identifiantPériode).appelOffre,
        période: Période.IdentifiantPériode.convertirEnValueType(identifiantPériode).période,
        estNotifiée: false,
      };
};
