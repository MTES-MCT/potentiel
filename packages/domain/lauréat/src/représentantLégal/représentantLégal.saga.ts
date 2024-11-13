import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../lauréat';

import { ImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';

export type SubscriptionEvent = LauréatNotifiéEvent;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'LauréatNotifié-V1':
        const { identifiantProjet, notifiéLe } = event.payload;

        await mediator.send<ImporterReprésentantLégalCommand>({
          type: 'Lauréat.ReprésentantLégal.Command.ImporterReprésentantLégal',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            importéLe: DateTime.convertirEnValueType(notifiéLe),
            importéPar: Email.system(),
          },
        });

        break;
    }
  };
  mediator.register('System.Lauréat.ReprésentantLégal.Saga.Execute', handler);
};
