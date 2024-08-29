import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';

import { SupprimerRaccordementCommand } from './supprimer/supprimerRaccordement.command';

export type SubscriptionEvent = Abandon.AbandonAccordéEvent;

export type Execute = Message<'System.Réseau.Raccordement.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'AbandonAccordé-V1':
        await mediator.send<SupprimerRaccordementCommand>({
          type: 'Réseau.Raccordement.Command.SupprimerRaccordement',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          },
        });
        break;
    }
  };
  mediator.register('System.Réseau.Raccordement.Saga.Execute', handler);
};
