import { Message, MessageHandler, mediator } from 'mediateur';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { AjouterTâcheCommand } from '../ajouter/ajouterTâche.command';
import { AcheverTâcheCommand } from '../achever/acheverTâche.command';
import * as Tâche from '../typeTâche.valueType';

export type SubscriptionEvent =
  | GarantiesFinancières.GarantiesFinancièresDemandéesEvent
  | GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent
  | GarantiesFinancières.GarantiesFinancièresEnregistréesEvent;

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
            typeTâche: Tâche.garantiesFinancièresDemander,
          },
        });
        break;
      case 'DépôtGarantiesFinancièresSoumis-V1':
      case 'GarantiesFinancièresEnregistrées-V1':
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.garantiesFinancièresDemander,
          },
        });
        break;
    }
  };

  mediator.register('System.Saga.TâcheGarantiesFinancières', handler);
};
