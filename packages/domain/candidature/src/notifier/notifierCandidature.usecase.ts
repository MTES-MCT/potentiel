import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { NotifierCandidatureCommand } from './notifierCandidature.command';

export type NotifierCandidatureUseCase = Message<
  'Candidature.UseCase.NotifierCandidature',
  {
    identifiantProjetValue: string;
  }
>;

export const registerNotifierCandidatureUseCase = () => {
  const handler: MessageHandler<NotifierCandidatureUseCase> = async ({
    identifiantProjetValue,
  }) => {
    await mediator.send<NotifierCandidatureCommand>({
      type: 'Candidature.Command.NotifierCandidature',
      data: { identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue) },
    });
  };

  mediator.register('Candidature.UseCase.NotifierCandidature', handler);
};
