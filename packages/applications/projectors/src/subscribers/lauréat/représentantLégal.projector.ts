import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

import { removeProjection, upsertProjection } from '../../infrastructure/';

export type SubscriptionEvent =
  | (ReprésentantLégal.ReprésentantLégalEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<ReprésentantLégal.ReprésentantLégalEntity>(
        `représentant-légal|${payload.id}`,
      );
      return;
    }

    const { identifiantProjet } = payload;

    const représentantLégal = await findProjection<ReprésentantLégal.ReprésentantLégalEntity>(
      `représentant-légal|${identifiantProjet}`,
    );

    const représentantLégalDefaultValue: Omit<ReprésentantLégal.ReprésentantLégalEntity, 'type'> = {
      identifiantProjet,
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.inconnu.formatter(),
      nomReprésentantLégal: '',
    };

    const représentantLégalToUpsert: Omit<ReprésentantLégal.ReprésentantLégalEntity, 'type'> =
      Option.isSome(représentantLégal) ? représentantLégal : représentantLégalDefaultValue;

    switch (type) {
      case 'ReprésentantLégalImporté-V1':
        await upsertProjection<ReprésentantLégal.ReprésentantLégalEntity>(
          `représentant-légal|${identifiantProjet}`,
          {
            identifiantProjet,
            typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.inconnu.formatter(),
            nomReprésentantLégal: payload.nomReprésentantLégal,
          },
        );
        break;
      case 'ReprésentantLégalModifié-V1':
        await upsertProjection<ReprésentantLégal.ReprésentantLégalEntity>(
          `représentant-légal|${payload.identifiantProjet}`,
          {
            ...représentantLégalToUpsert,
            nomReprésentantLégal: payload.nomReprésentantLégal,
            typeReprésentantLégal: payload.typeReprésentantLégal,
          },
        );
        break;
    }
  };

  mediator.register('System.Projector.Lauréat.ReprésentantLégal', handler);
};
