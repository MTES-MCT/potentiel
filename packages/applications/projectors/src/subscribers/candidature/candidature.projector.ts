import { Message, MessageHandler, mediator } from 'mediateur';

import { CandidatureEntity, CandidatureImportéeEvent } from '@potentiel-domain/candidature';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { StatutProjet } from '@potentiel-domain/common';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (CandidatureImportéeEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<CandidatureEntity>(`candidature|${payload.id}`);
    } else {
      const { statut, identifiantProjet, nomProjet } = payload;

      const candidatureDefaultValue: Omit<CandidatureEntity, 'type'> = {
        identifiantProjet,
        statut: StatutProjet.convertirEnValueType(statut).statut,
        nom: nomProjet,
      };

      switch (type) {
        case 'CandidatureImportée-V1':
          await upsertProjection<CandidatureEntity>(`candidature|${identifiantProjet}`, {
            ...candidatureDefaultValue,
          });
          break;
      }
    }
  };

  mediator.register('System.Projector.Candidature', handler);
};
