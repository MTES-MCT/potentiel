import { Message, MessageHandler, mediator } from 'mediateur';

import { Actionnaire, Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { updateOneProjection } from '../../infrastructure';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    console.log('viovio proj');
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      const { id } = payload;

      const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);

      if (Option.isSome(lauréatProjection)) {
        await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${id}`, {
          actionnaire: undefined,
        });
      }

      // await removeProjection<Actionnaire.DemandeModificationActionnaireEntity>(
      //   `demande-modification-actionnaire|${id}`,
      // );
    } else {
      const { identifiantProjet } = payload;

      switch (type) {
        case 'ActionnaireImporté-V1':
          console.log('viovio projector');
          try {
            await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
              actionnaire: {
                nom: payload.actionnaire,
                dernièreMiseÀJourLe: payload.importéLe,
              },
            });
          } catch (e) {
            console.log(e);
          }
          break;

        case 'ActionnaireModifié-V1':
          await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            actionnaire: {
              nom: payload.actionnaire,
              dernièreMiseÀJourLe: payload.modifiéLe,
            },
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
