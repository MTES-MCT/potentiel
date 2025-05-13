import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { SupprimerUtilisateurCommand } from './supprimerUtilisateur.command';

export type SupprimerUtilisateurUseCase = Message<
  'Utilisateur.UseCase.SupprimerUtilisateur',
  {
    identifiantUtilisateurValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
  }
>;

export const registerSupprimerUseCase = () => {
  const runner: MessageHandler<SupprimerUtilisateurUseCase> = async ({
    identifiantUtilisateurValue,
    suppriméLeValue,
    suppriméParValue,
  }) => {
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const suppriméLe = DateTime.convertirEnValueType(suppriméLeValue);
    const suppriméPar = Email.convertirEnValueType(suppriméParValue);

    await mediator.send<SupprimerUtilisateurCommand>({
      type: 'Utilisateur.Command.SupprimerUtilisateur',
      data: {
        identifiantUtilisateur,
        suppriméLe,
        suppriméPar,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.SupprimerUtilisateur', runner);
};
