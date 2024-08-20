import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { NotifierCandidatureCommand } from './notifierCandidature.command';

export type NotifierCandidatureUseCase = Message<
  'Candidature.UseCase.NotifierCandidature',
  {
    identifiantProjetValue: string;
    dateNotificationValue: string;
  }
>;

export const registerNotifierCandidatureUseCase = () => {
  const handler: MessageHandler<NotifierCandidatureUseCase> = async ({
    identifiantProjetValue,
    dateNotificationValue,
  }) => {
    await mediator.send<NotifierCandidatureCommand>({
      type: 'Candidature.Command.NotifierCandidature',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        dateNotification: DateTime.convertirEnValueType(dateNotificationValue),
      },
    });
  };

  mediator.register('Candidature.UseCase.NotifierCandidature', handler);
};
