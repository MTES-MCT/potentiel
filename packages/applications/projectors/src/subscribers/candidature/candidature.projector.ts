import { Message, MessageHandler, mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';

import { removeProjection } from '../../infrastructure/removeProjection';
import { upsertProjection } from '../../infrastructure/upsertProjection';

export type SubscriptionEvent = (Candidature.CandidatureEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Candidature', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<Candidature.CandidatureEntity>(`candidature|${payload.id}`);
    } else {
      const { identifiantProjet, historiqueAbandon, technologie, ...restPayload } = payload;

      const baseCandidature = {
        ...restPayload,
        identifiantProjet,
        historiqueAbandon:
          Candidature.HistoriqueAbandon.convertirEnValueType(historiqueAbandon).type,
        technologie: Candidature.Technologie.convertirEnValueType(technologie).type,
      };
      const candidatureDefaultValue: Candidature.CandidatureEntityData =
        payload.statut === 'classé'
          ? payload.typeGarantiesFinancières === 'avec-date-échéance'
            ? {
                ...baseCandidature,
                statut: 'classé',
                typeGarantiesFinancières: payload.typeGarantiesFinancières,
                dateÉchéanceGf: DateTime.convertirEnValueType(payload.dateÉchéanceGf).formatter(),
              }
            : {
                ...baseCandidature,
                statut: 'classé',
                typeGarantiesFinancières: payload.typeGarantiesFinancières,
              }
          : {
              ...baseCandidature,
              statut: 'éliminé',
            };

      switch (type) {
        case 'CandidatureImportée-V1':
        case 'CandidatureCorrigée-V1':
          await upsertProjection<Candidature.CandidatureEntity>(
            `candidature|${identifiantProjet}`,
            candidatureDefaultValue,
          );
          break;
      }
    }
  };

  mediator.register('System.Projector.Candidature', handler);
};
