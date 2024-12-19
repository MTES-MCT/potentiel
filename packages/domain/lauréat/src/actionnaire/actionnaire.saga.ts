import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { LauréatNotifiéEvent } from '../lauréat';

import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { DemandeChangementActionnaireAccordéeEvent } from './accorderDemandeChangement/accorderDemandeChangement.behavior';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';

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

      case 'DemandeChangementActionnaireAccordée-V1':
        const { accordéePar, accordéeLe, nouvelActionnaire } = event.payload;

        await mediator.send<ModifierActionnaireCommand>({
          type: 'Lauréat.Actionnaire.Command.ModifierActionnaire',
          data: {
            identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
            identifiantUtilisateur: Email.convertirEnValueType(accordéePar),
            actionnaire: nouvelActionnaire,
            dateModification: DateTime.convertirEnValueType(accordéeLe),
          },
        });

        break;
    }
  };
  mediator.register('System.Lauréat.Actionnaire.Saga.Execute', handler);
};
