import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../infrastructure/';

export type SubscriptionEvent =
  | (ReprésentantLégal.ReprésentantLégalEvent & Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.ReprésentantLégal', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'RebuildTriggered' }, async ({ payload: { id } }) => {
        const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(`lauréat|${id}`);
        if (Option.isSome(lauréatProjection)) {
          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${id}`, {
            ...lauréatProjection,
            représentantLégal: undefined,
          });
        }
      })
      .with(
        { type: 'ReprésentantLégalImporté-V1' },
        async ({ payload: { identifiantProjet, nomReprésentantLégal } }) => {
          const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(
            `lauréat|${identifiantProjet}`,
          );

          if (Option.isNone(lauréatProjection)) {
            getLogger().error(
              new Error(
                `[${new Date().toISOString()}] [System.Projector.Lauréat.ReprésentantLégal] Projection lauréat non trouvée pour le projet ${identifiantProjet}`,
              ),
            );
            return;
          }

          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            ...lauréatProjection,
            représentantLégal: {
              nom: nomReprésentantLégal,
              type: ReprésentantLégal.TypeReprésentantLégal.inconnu.formatter(),
            },
          });
        },
      )
      .with(
        { type: 'ReprésentantLégalModifié-V1' },
        async ({ payload: { identifiantProjet, nomReprésentantLégal, typeReprésentantLégal } }) => {
          const lauréatProjection = await findProjection<Lauréat.LauréatEntity>(
            `lauréat|${identifiantProjet}`,
          );

          if (Option.isNone(lauréatProjection)) {
            getLogger().error(
              new Error(
                `[${new Date().toISOString()}] [System.Projector.Lauréat.ReprésentantLégal] Projection lauréat non trouvée pour le projet ${identifiantProjet}`,
              ),
            );
            return;
          }

          await upsertProjection<Lauréat.LauréatEntity>(`lauréat|${identifiantProjet}`, {
            ...lauréatProjection,
            représentantLégal: {
              nom: nomReprésentantLégal,
              type: typeReprésentantLégal,
            },
          });
        },
      )
      .exhaustive();

  mediator.register('System.Projector.Lauréat.ReprésentantLégal', handler);
};
