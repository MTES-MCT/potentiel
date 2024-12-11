import { Message, MessageHandler, mediator } from 'mediateur';

import { Actionnaire, Lauréat } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { removeProjection, updateOneProjection, upsertProjection } from '../../infrastructure';

export type SubscriptionEvent = (Actionnaire.ActionnaireEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.Actionnaire', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      const { id } = payload;

      // Lauréat
      const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);

      if (Option.isSome(lauréatProjection)) {
        await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${id}`, {
          actionnaire: undefined,
        });
      }

      // Demande modification
      await removeProjection<Actionnaire.DemandeModificationActionnaireEntity>(
        `demande-modification-actionnaire|${id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      switch (type) {
        // Impact sur Lauréat
        case 'ActionnaireImporté-V1':
          await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            actionnaire: {
              nom: payload.actionnaire,
              dernièreMiseÀJourLe: payload.importéLe,
            },
          });

          break;

        case 'ActionnaireModifié-V1':
          await updateOneProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            actionnaire: {
              nom: payload.actionnaire,
              dernièreMiseÀJourLe: payload.modifiéLe,
            },
          });
          break;

        // Impact sur DemandeActionnaire
        case 'ModificationActionnaireDemandée-V1':
          const {
            demandéLe,
            demandéPar,
            raison,
            pièceJustificative: { format },
          } = event.payload;

          await upsertProjection<Actionnaire.DemandeModificationActionnaireEntity>(
            `demande-modification-actionnaire|${identifiantProjet}`,
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

  mediator.register('System.Projector.Lauréat.Actionnaire', handler);
};
