import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { DésactiverUtilisateurCommand } from './désactiverUtilisateur.command.js';

export type DésactiverUtilisateurUseCase = Message<
  'Utilisateur.UseCase.DésactiverUtilisateur',
  {
    identifiantUtilisateurValue: string;
    désactivéLeValue: string;
    désactivéParValue: string;
  }
>;

export const registerDésactiverUseCase = () => {
  const runner: MessageHandler<DésactiverUtilisateurUseCase> = async ({
    identifiantUtilisateurValue,
    désactivéLeValue,
    désactivéParValue,
  }) => {
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const désactivéLe = DateTime.convertirEnValueType(désactivéLeValue);
    const désactivéPar = Email.convertirEnValueType(désactivéParValue);

    await mediator.send<DésactiverUtilisateurCommand>({
      type: 'Utilisateur.Command.DésactiverUtilisateur',
      data: {
        identifiantUtilisateur,
        désactivéLe,
        désactivéPar,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.DésactiverUtilisateur', runner);
};
