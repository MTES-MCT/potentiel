import { Message, MessageHandler, mediator } from 'mediateur';

import { Abandon } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { AjouterTâcheCommand } from '../ajouter/ajouterTâche.command';
import { AcheverTâcheCommand } from '../achever/acheverTâche.command';
import * as Tâche from '../typeTâche.valueType';

export type SubscriptionEvent =
  | Abandon.AbandonAnnuléEvent
  | Abandon.AbandonConfirméEvent
  | Abandon.AbandonRejetéEvent
  | Abandon.ConfirmationAbandonDemandéeEvent
  | Abandon.PreuveRecandidatureDemandéeEvent
  | Abandon.PreuveRecandidatureTransmiseEvent;

export type Execute = Message<'System.Saga.TâcheAbandon', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'ConfirmationAbandonDemandée-V1':
        await mediator.send<AjouterTâcheCommand>({
          type: 'System.Tâche.Command.AjouterTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.abandonConfirmer,
          },
        });
        break;
      case 'AbandonAnnulé-V1':
      case 'AbandonConfirmé-V1':
      case 'AbandonRejeté-V1':
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.abandonConfirmer,
          },
        });
        break;
      case 'PreuveRecandidatureDemandée-V1':
        await mediator.send<AjouterTâcheCommand>({
          type: 'System.Tâche.Command.AjouterTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.abandonTransmettrePreuveRecandidature,
          },
        });
        break;
      case 'PreuveRecandidatureTransmise-V1':
        await mediator.send<AcheverTâcheCommand>({
          type: 'System.Tâche.Command.AcheverTâche',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            typeTâche: Tâche.abandonTransmettrePreuveRecandidature,
          },
        });
        break;
    }
  };

  mediator.register('System.Saga.TâcheAbandon', handler);
};
