import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { InviterPorteurCommand } from './inviterPorteur.command.js';

export type InviterPorteurUseCase = Message<
  'Utilisateur.UseCase.InviterPorteur',
  {
    identifiantUtilisateurValue: string;
    identifiantsProjetValues: string[];
    invitéLeValue: string;
    invitéParValue: string;
  }
>;

export const registerInviterPorteurUseCase = () => {
  const runner: MessageHandler<InviterPorteurUseCase> = async ({
    identifiantUtilisateurValue,
    identifiantsProjetValues,
    invitéLeValue,
    invitéParValue,
  }) => {
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const invitéPar = Email.convertirEnValueType(invitéParValue);
    const invitéLe = DateTime.convertirEnValueType(invitéLeValue);

    await mediator.send<InviterPorteurCommand>({
      type: 'Utilisateur.Command.InviterPorteur',
      data: {
        identifiantUtilisateur,
        identifiantsProjet: identifiantsProjetValues,
        invitéLe,
        invitéPar,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.InviterPorteur', runner);
};
