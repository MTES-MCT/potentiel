import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { Role } from '..';

import { InviterUtilisateurCommand } from './inviter.command';

export type InviterUtilisateurUseCase = Message<
  'Utilisateur.UseCase.InviterUtilisateur',
  {
    identifiantUtilisateurValue: string;
    rôleValue: string;
    invitéLeValue: string;
    invitéParValue: string;

    région?: string;
    identifiantGestionnaireRéseau?: string;
  }
>;

export const registerInviterUseCase = () => {
  const runner: MessageHandler<InviterUtilisateurUseCase> = async ({
    identifiantUtilisateurValue,
    rôleValue,
    invitéLeValue,
    invitéParValue,
    région,
    identifiantGestionnaireRéseau,
  }) => {
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const rôle = Role.convertirEnValueType(rôleValue);
    const invitéLe = DateTime.convertirEnValueType(invitéLeValue);
    const invitéPar = Email.convertirEnValueType(invitéParValue);

    await mediator.send<InviterUtilisateurCommand>({
      type: 'Utilisateur.Command.InviterUtilisateur',
      data: {
        identifiantUtilisateur,
        rôle,
        invitéLe,
        invitéPar,
        région,
        // TODO value type?
        identifiantGestionnaireRéseau,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.InviterUtilisateur', runner);
};
