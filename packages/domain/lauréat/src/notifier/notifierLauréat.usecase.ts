import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { NotifierLauréatCommand } from './notifierLauréat.command';

export type NotifierLauréatUseCase = Message<
  'Lauréat.UseCase.NotifierLauréat',
  {
    identifiantProjetValue: string;
    dateNotificationValue: string;
  }
>;

export const registerNotifierLauréatUseCase = () => {
  const handler: MessageHandler<NotifierLauréatUseCase> = async ({
    identifiantProjetValue,
    dateNotificationValue,
  }) => {
    await mediator.send<NotifierLauréatCommand>({
      type: 'Lauréat.Command.NotifierLauréat',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        dateNotification: DateTime.convertirEnValueType(dateNotificationValue),
      },
    });
  };

  mediator.register('Lauréat.UseCase.NotifierLauréat', handler);
};
