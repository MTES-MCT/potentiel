import { Message, MessageHandler, mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { AjouterTâcheCommand } from '../ajouter/ajouterTâche.command';
import { AcheverTâcheCommand } from '../achever/acheverTâche.command';
import * as Tâche from '../typeTâche.valueType';
import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
import { AjouterTâchePlanifiéeCommand } from '../planifier/planifierTâche.command';

export type SubscriptionEvent =
  | GarantiesFinancières.GarantiesFinancièresDemandéesEvent
  | GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent
  | GarantiesFinancières.GarantiesFinancièresEnregistréesEvent
  | GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent
  | GarantiesFinancières.GarantiesFinancièresModifiéesEvent;

export type Execute = Message<'System.Saga.TâcheGarantiesFinancières', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'GarantiesFinancièresDemandées-V1':
        await mediator.send<AjouterTâcheCommand>({
          type: 'System.Tâche.Command.AjouterTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.garantiesFinancieresDemander,
          },
        });
        break;
      case 'DépôtGarantiesFinancièresSoumis-V1':
      case 'GarantiesFinancièresEnregistrées-V1':
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.garantiesFinancieresDemander,
          },
        });
        break;
      case 'DépôtGarantiesFinancièresEnCoursValidé-V2':
      case 'GarantiesFinancièresModifiées-V1':
        if (event.payload.type === 'avec-date-échéance' && event.payload.dateÉchéance) {
          await mediator.send<AjouterTâchePlanifiéeCommand>({
            type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
            data: {
              identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              typeTâchePlanifiée: TâchePlanifiée.garantiesFinancieresÉchoir,
              àExecuterLe: DateTime.convertirEnValueType(
                event.payload.dateÉchéance,
              ).ajouterNombreDeJours(1),
            },
          });
        }

        break;
    }
  };

  mediator.register('System.Saga.TâcheGarantiesFinancières', handler);
};
