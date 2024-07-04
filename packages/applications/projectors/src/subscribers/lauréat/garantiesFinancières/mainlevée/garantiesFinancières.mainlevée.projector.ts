import { Message, MessageHandler, mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { removeProjection } from '../../../../infrastructure/removeProjection';

import { applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée } from './helpers/applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée';
import { applyDemandeMainlevéeGarantiesFinancièresAnnulée } from './helpers/applyDemandeMainlevéeGarantiesFinancièresAnnulée';
import { applyMainlevéeGarantiesFinancièresDemandée } from './helpers/applyMainlevéeGarantiesFinancièresDemandée';
import { applyDemandeMainlevéeGarantiesFinancièresAccordée } from './helpers/applyDemandeMainlevéeGarantiesFinancièresAccordée';
import { applyDemandeMainlevéeGarantiesFinancièresRejetée } from './helpers/applyDemandeMainlevéeGarantiesFinancièresRejetée';

export type SubscriptionEvent =
  | (GarantiesFinancières.GarantiesFinancièresEvent & Event)
  | RebuildTriggered;

export type Execute = Message<
  'System.Projector.Lauréat.GarantiesFinancières.Mainlevée',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;
    if (type === 'RebuildTriggered') {
      await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
        `mainlevee-garanties-financieres|${payload.id}`,
      );
    } else {
      switch (type) {
        case 'MainlevéeGarantiesFinancièresDemandée-V1':
          await applyMainlevéeGarantiesFinancièresDemandée(event);
          break;

        case 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1':
          await applyDemandeMainlevéeGarantiesFinancièresAnnulée(event);
          break;

        case 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1':
          await applyInstructionDemandeMainlevéeGarantiesFinancièresDémarrée(event);
          break;

        case 'DemandeMainlevéeGarantiesFinancièresAccordée-V1':
          await applyDemandeMainlevéeGarantiesFinancièresAccordée(event);
          break;

        case 'DemandeMainlevéeGarantiesFinancièresRejetée-V1':
          await applyDemandeMainlevéeGarantiesFinancièresRejetée(event);
          break;
      }
    }
  };

  mediator.register('System.Projector.Lauréat.GarantiesFinancières.Mainlevée', handler);
};
