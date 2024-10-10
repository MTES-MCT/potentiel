import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { NotifierCandidatureCommand } from './notifierCandidature.command';

export type NotifierCandidatureUseCase = Message<
  'Candidature.UseCase.NotifierCandidature',
  {
    identifiantProjetValue: string;
    notifiéeLeValue: string;
    notifiéeParValue: string;
    notifiéeParDétailsValue: {
      fonction: string;
      nomComplet: string;
    };
    attestationValue: {
      format: string;
    };
  }
>;

export const registerNotifierCandidatureUseCase = () => {
  const handler: MessageHandler<NotifierCandidatureUseCase> = async ({
    identifiantProjetValue,
    notifiéeParValue,
    notifiéeLeValue,
    notifiéeParDétailsValue,
    attestationValue: { format },
  }) => {
    await mediator.send<NotifierCandidatureCommand>({
      type: 'Candidature.Command.NotifierCandidature',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        notifiéeLe: DateTime.convertirEnValueType(notifiéeLeValue),
        notifiéePar: Email.convertirEnValueType(notifiéeParValue),
        notifiéeParDétails: notifiéeParDétailsValue,
        attestation: { format },
      },
    });
  };

  mediator.register('Candidature.UseCase.NotifierCandidature', handler);
};
