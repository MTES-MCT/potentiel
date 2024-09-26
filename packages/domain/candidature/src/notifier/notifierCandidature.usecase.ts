import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { NotifierCandidatureCommand } from './notifierCandidature.command';

export type NotifierCandidatureUseCase = Message<
  'Candidature.UseCase.NotifierCandidature',
  {
    identifiantProjetValue: string;
    notifiéLeValue: string;
    notifiéParValue: string;
    attestationValue: {
      format: string;
    };
  }
>;

export const registerNotifierCandidatureUseCase = () => {
  const handler: MessageHandler<NotifierCandidatureUseCase> = async ({
    identifiantProjetValue,
    notifiéParValue,
    notifiéLeValue,
    attestationValue: { format },
  }) => {
    await mediator.send<NotifierCandidatureCommand>({
      type: 'Candidature.Command.NotifierCandidature',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        notifiéLe: DateTime.convertirEnValueType(notifiéLeValue),
        notifiéPar: Email.convertirEnValueType(notifiéParValue),
        attestation: { format },
      },
    });
  };

  mediator.register('Candidature.UseCase.NotifierCandidature', handler);
};
