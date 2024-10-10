import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { NotifierÉliminéCommand } from './notifierÉliminé.command';

export type NotifierÉliminéUseCase = Message<
  'Éliminé.UseCase.NotifierÉliminé',
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

export const registerNotifierÉliminéUseCase = () => {
  const handler: MessageHandler<NotifierÉliminéUseCase> = async ({
    identifiantProjetValue,
    notifiéLeValue,
    notifiéParValue,
    validateurValue,
    attestationValue: { format },
  }) => {
    await mediator.send<Candidature.NotifierCandidatureUseCase>({
      type: 'Candidature.UseCase.NotifierCandidature',
      data: {
        identifiantProjetValue,
        notifiéeLeValue: notifiéLeValue,
        notifiéeParValue: notifiéParValue,
        validateurValue,
        attestationValue: {
          format: 'application/pdf',
        },
      },
    });
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
