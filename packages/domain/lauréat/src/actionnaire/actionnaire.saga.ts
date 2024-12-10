import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../lauréat';

import { DemandeChangementActionnaireAccordéeEvent } from '.';

import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';

export type SubscriptionEvent = LauréatNotifiéEvent | DemandeChangementActionnaireAccordéeEvent;

export type Execute = Message<'System.Lauréat.Actionnaire.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { identifiantProjet } = event.payload;

    switch (event.type) {
      case 'LauréatNotifié-V1':
        const { notifiéLe } = event.payload;

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
