import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../lauréat';

import { ImporterActionnaireCommand } from './importerActionnaire/importerActionnaire.command';

export type SubscriptionEvent = LauréatNotifiéEvent;

export type Execute = Message<'System.Lauréat.Actionnaire.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'LauréatNotifié-V1':
        const { identifiantProjet, notifiéLe } = event.payload;

        await mediator.send<ImporterActionnaireCommand>({
          type: 'Lauréat.Actionnaire.Command.ImporterActionnaire',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            importéLe: DateTime.convertirEnValueType(notifiéLe),
          },
        });

        break;
    }
  };
  mediator.register('System.Lauréat.Actionnaire.Saga.Execute', handler);
};
