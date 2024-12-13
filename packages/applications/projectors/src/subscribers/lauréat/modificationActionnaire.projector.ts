import { Message, MessageHandler, mediator } from 'mediateur';

import { Actionnaire } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection, upsertProjection } from '../../infrastructure';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<
  'System.Projector.Lauréat.ModificationActionnaire',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      const { id } = payload;

      await removeProjection<Actionnaire.ModificationActionnaireEntity>(
        `modification-actionnaire|${id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      switch (type) {
        case 'ModificationActionnaireDemandée-V1':
          const {
            demandéLe,
            demandéPar,
            raison,
            pièceJustificative: { format },
          } = event.payload;

          await upsertProjection<Actionnaire.ModificationActionnaireEntity>(
            `modification-actionnaire|${identifiantProjet}`,
            {
              identifiantProjet,
              statut: Actionnaire.StatutModificationActionnaire.demandé.statut,
              misÀJourLe: demandéLe,

              demande: {
                demandéPar,
                demandéLe,
                raison,
                pièceJustificative: {
                  format,
                },
              },
            },
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.ModificationActionnaire', handler);
};
