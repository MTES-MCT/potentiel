import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import type { NotifierLauréatCommand } from './notifierLauréat.command';

export type NotifierLauréatUseCase = Message<
  'Lauréat.UseCase.NotifierLauréat',
  {
    identifiantProjetValue: string;
    notifiéLeValue: string;
    notifiéParValue: string;
    validateurValue: AppelOffre.Validateur;
    attestationValue: {
      format: string;
    };
  }
>;

export const registerNotifierLauréatUseCase = () => {
  const handler: MessageHandler<NotifierLauréatUseCase> = async ({
    identifiantProjetValue,
    notifiéLeValue,
    notifiéParValue,
    validateurValue,
    attestationValue: { format },
  }) => {
    await mediator.send<NotifierLauréatCommand>({
      type: 'Lauréat.Command.NotifierLauréat',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        notifiéLe: DateTime.convertirEnValueType(notifiéLeValue),
        notifiéPar: Email.convertirEnValueType(notifiéParValue),
        validateur: validateurValue,
        attestation: { format },
      },
    });
  };

  mediator.register('Lauréat.UseCase.NotifierLauréat', handler);
};
