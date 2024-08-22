import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { NotifierÉliminéCommand } from './notifierÉliminé.command';

export type NotifierÉliminéUseCase = Message<
  'Éliminé.UseCase.NotifierÉliminé',
  {
    identifiantProjetValue: string;
    dateNotificationValue: string;
  }
>;

export const registerNotifierÉliminéUseCase = () => {
  const handler: MessageHandler<NotifierÉliminéUseCase> = async ({
    identifiantProjetValue,
    dateNotificationValue,
  }) => {
    await mediator.send<NotifierÉliminéCommand>({
      type: 'Éliminé.Command.NotifierÉliminé',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        dateNotification: DateTime.convertirEnValueType(dateNotificationValue),
      },
    });
  };

  mediator.register('Éliminé.UseCase.NotifierÉliminé', handler);
};
