import { Message, MessageHandler, mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../../../infrastructure/removeProjection';

import { applyDépôtGarantiesFinancièresSoumis } from './applyDépôtGarantiesFinancièresSoumis';
import { applyDépôtGarantiesFinancièresEnCoursSupprimé } from './applyDépôtGarantiesFinancièresEnCoursSupprimé';
import { applyDépôtGarantiesFinancièresEnCoursValidé } from './applyDépôtGarantiesFinancièresEnCoursValidé';
import { applyDépôtGarantiesFinancièresEnCoursModifié } from './applyDépôtGarantiesFinancièresEnCoursModifié';
import { applyHistoriqueGarantiesFinancièresEffacé } from './applyHistoriqueGarantiesFinancièresEffacé';

export type SubscriptionEvent =
  | ((
      | GarantiesFinancières.DépôtGarantiesFinancièresEvent
      | GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent
    ) &
      Event)
  | RebuildTriggered;

export type Execute = Message<'System.Projector.Lauréat.GarantiesFinancières', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;
    if (type === 'RebuildTriggered') {
      await removeProjection<GarantiesFinancières.DépôtEnCoursGarantiesFinancièresEntity>(
        `depot-en-cours-garanties-financieres|${payload.id}`,
      );
    } else {
      const { identifiantProjet } = payload;

      switch (type) {
        case 'DépôtGarantiesFinancièresSoumis-V1':
          applyDépôtGarantiesFinancièresSoumis(identifiantProjet, event);
          break;

        case 'DépôtGarantiesFinancièresEnCoursSupprimé-V1':
          applyDépôtGarantiesFinancièresEnCoursSupprimé(identifiantProjet);
          break;

        case 'DépôtGarantiesFinancièresEnCoursValidé-V1':
          applyDépôtGarantiesFinancièresEnCoursValidé(identifiantProjet, event);
          break;

        case 'DépôtGarantiesFinancièresEnCoursModifié-V1':
          applyDépôtGarantiesFinancièresEnCoursModifié(identifiantProjet, event);
          break;

        case 'HistoriqueGarantiesFinancièresEffacé-V1':
          applyHistoriqueGarantiesFinancièresEffacé(identifiantProjet);
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.GarantiesFinancières', handler);
};
