import { Message, MessageHandler, mediator } from 'mediateur';

import { removeProjection } from '../utils/removeProjection';
import { upsertProjection } from '../utils/upsertProjection';
import { Abandon } from '@potentiel-domain/laureat';
import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

export type ExecuteAbandonAvecRecandidatureSansPreuveProjector = Message<
  'EXECUTE_ABANDON_AVEC_RECANDIDATURE_SANS_PREUVE_PROJECTOR',
  | Abandon.PreuveRecandidatureDemandéeEvent
  | Abandon.PreuveRecandidatureTransmiseEvent
  | RebuildTriggered
>;

export const registerAbandonAvecRecandidatureSansPreuveProjector = () => {
  const handler: MessageHandler<ExecuteAbandonAvecRecandidatureSansPreuveProjector> = async (
    event,
  ) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
        `abandon-avec-recandidature-sans-preuve|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      switch (type) {
        case 'PreuveRecandidatureDemandée-V1':
          await upsertProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
            `abandon-avec-recandidature-sans-preuve|${identifiantProjet}`,
            payload,
          );
          break;
        case 'PreuveRecandidatureTransmise-V1':
          await removeProjection<Abandon.AbandonAvecRecandidatureSansPreuveProjection>(
            `abandon-avec-recandidature-sans-preuve|${identifiantProjet}`,
          );
      }
    }
  };

  mediator.register('EXECUTE_ABANDON_AVEC_RECANDIDATURE_SANS_PREUVE_PROJECTOR', handler);
};
