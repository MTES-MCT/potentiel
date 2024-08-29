import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { NotifierÉliminéCommand } from './notifierÉliminé.command';

export type NotifierÉliminéUseCase = Message<
  'Éliminé.UseCase.NotifierÉliminé',
  {
    identifiantProjetValue: string;
    notifiéLeValue: string;
    notifiéParValue: string;
    attestationValue: {
      format: string;
    };
  }
>;

export const registerNotifierÉliminéUseCase = () => {
  const handler: MessageHandler<NotifierÉliminéUseCase> = async ({
    identifiantProjetValue,
    notifiéLeValue,
    notifiéParValue,
    attestationValue: { format },
  }) => {
    await mediator.send<NotifierÉliminéCommand>({
      type: 'Éliminé.Command.NotifierÉliminé',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        notifiéLe: DateTime.convertirEnValueType(notifiéLeValue),
        notifiéPar: Email.convertirEnValueType(notifiéParValue),
        attestation: { format },
      },
    });
  };

  mediator.register('Éliminé.UseCase.NotifierÉliminé', handler);
};
