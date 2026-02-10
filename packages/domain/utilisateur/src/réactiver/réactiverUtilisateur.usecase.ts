import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { RéactiverUtilisateurCommand } from './réactiverUtilisateur.command.js';

export type RéactiverUtilisateurUseCase = Message<
  'Utilisateur.UseCase.RéactiverUtilisateur',
  {
    identifiantUtilisateurValue: string;
    réactivéLeValue: string;
    réactivéParValue: string;
  }
>;

export const registerRéactiverUseCase = () => {
  const runner: MessageHandler<RéactiverUtilisateurUseCase> = async ({
    identifiantUtilisateurValue,
    réactivéLeValue,
    réactivéParValue,
  }) => {
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const réactivéLe = DateTime.convertirEnValueType(réactivéLeValue);
    const réactivéPar = Email.convertirEnValueType(réactivéParValue);

    await mediator.send<RéactiverUtilisateurCommand>({
      type: 'Utilisateur.Command.RéactiverUtilisateur',
      data: {
        identifiantUtilisateur,
        réactivéLe,
        réactivéPar,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.RéactiverUtilisateur', runner);
};
