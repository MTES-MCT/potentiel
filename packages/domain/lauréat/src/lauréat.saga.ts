import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Recours } from '@potentiel-domain/elimine';

import { NotifierLauréatCommand } from './notifier/notifierLauréat.command';

export type SubscriptionEvent = Recours.RecoursAccordéEvent;

export type Execute = Message<'System.Lauréat.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'RecoursAccordé-V1':
        const {
          accordéLe,
          accordéPar,
          réponseSignée: { format },
        } = event.payload;
        await mediator.send<NotifierLauréatCommand>({
          type: 'Lauréat.Command.NotifierLauréat',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            notifiéLe: DateTime.convertirEnValueType(accordéLe),
            notifiéPar: Email.convertirEnValueType(accordéPar),
            attestation: { format },
          },
        });
        break;
    }
  };
  mediator.register('System.Lauréat.Saga.Execute', handler);
};
