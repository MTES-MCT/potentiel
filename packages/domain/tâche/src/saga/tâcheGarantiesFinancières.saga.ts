import { type Message, type MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import type { AcheverTâcheCommand } from '../achever/acheverTâche.command';
import type { AjouterTâcheCommand } from '../ajouter/ajouterTâche.command';
import * as Tâche from '../typeTâche.valueType';

export type SubscriptionEvent =
  | Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresSoumisEvent
  | Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent;

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
