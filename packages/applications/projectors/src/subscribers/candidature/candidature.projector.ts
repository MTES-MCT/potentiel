import { Message, MessageHandler, mediator } from 'mediateur';

import { Candidature, HistoriqueAbandon } from '@potentiel-domain/candidature';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

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
      const {
        identifiantProjet,
        statut,
        typeGarantiesFinancières,
        historiqueAbandon,
        dateÉchéanceGf,
        technologie,
        ...restPayload
      } = payload;

      const candidatureDefaultValue: Omit<Candidature.CandidatureEntity, 'type'> = {
        ...restPayload,
        identifiantProjet,
        statut: StatutProjet.convertirEnValueType(statut).statut,
        typeGarantiesFinancières: typeGarantiesFinancières
          ? GarantiesFinancières.TypeGarantiesFinancières.convertirEnValueType(
              typeGarantiesFinancières,
            ).type
          : undefined,
        historiqueAbandon: HistoriqueAbandon.convertirEnValueType(historiqueAbandon).type,
        dateÉchéanceGf: dateÉchéanceGf
          ? DateTime.convertirEnValueType(dateÉchéanceGf).formatter()
          : undefined,
        technologie: Candidature.Technologie.convertirEnValueType(technologie).type,
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
