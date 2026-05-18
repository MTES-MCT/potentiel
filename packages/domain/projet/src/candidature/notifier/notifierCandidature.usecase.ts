import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../index.js';
import type { NotifierCandidatureCommand } from './notifierCandidature.command.js';

export type NotifierCandidatureUseCase = Message<
  'Candidature.UseCase.NotifierCandidature',
  {
    identifiantProjetValue: string;
    notifiéeLeValue: string;
    notifiéeParValue: string;
    validateurValue: AppelOffre.Validateur;
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
    validateurValue,
    attestationValue: { format },
  }) => {
    await mediator.send<NotifierCandidatureCommand>({
      type: 'Candidature.Command.NotifierCandidature',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        notifiéeLe: DateTime.convertirEnValueType(notifiéeLeValue),
        notifiéePar: Email.convertirEnValueType(notifiéeParValue),
        validateur: validateurValue,
        attestation: { format },
      },
    });
  };

  mediator.register('Candidature.UseCase.NotifierCandidature', handler);
};
