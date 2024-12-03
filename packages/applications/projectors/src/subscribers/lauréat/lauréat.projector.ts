import { Message, MessageHandler, mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Lauréat.LauréatEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Lauréat.LauréatEntity>(`lauréat|${payload.id}`);
    } else {
      const { identifiantProjet } = payload;

      const lauréat = await findProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`);

      const lauréatDefaultValue: Omit<Lauréat.LauréatEntity, 'type'> = {
        identifiantProjet,
        notifiéLe: DateTime.now().formatter(),
        notifiéPar: '',
        actionnaire: { nom: '', dernièreMiseÀJourLe: DateTime.now().formatter() },
      };

      const lauréatToUpsert: Omit<Lauréat.LauréatEntity, 'type'> = Option.isSome(lauréat)
        ? lauréat
        : lauréatDefaultValue;

      switch (type) {
        case 'LauréatNotifié-V1':
          const { notifiéLe, notifiéPar } = payload;

          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            ...lauréatToUpsert,
            identifiantProjet,
            notifiéLe,
            notifiéPar,
            représentantLégal: undefined,
          });
          break;

        case 'LauréatActionnaireImporté-V1':
          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            ...lauréatToUpsert,
            identifiantProjet,
            actionnaire: {
              nom: payload.actionnaire,
              dernièreMiseÀJourLe: payload.importéLe,
            },
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat', handler);
};
