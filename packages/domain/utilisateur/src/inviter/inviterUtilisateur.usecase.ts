import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { Role } from '..';

import { InviterUtilisateurCommand } from './inviterUtilisateur.command';

export type InviterUtilisateurUseCase = Message<
  'Utilisateur.UseCase.InviterUtilisateur',
  {
    identifiantUtilisateurValue: string;
    rôleValue: string;
    invitéLeValue: string;
    invitéParValue: string;

    fonctionValue?: string;
    nomCompletValue?: string;
    régionValue?: string;
    identifiantGestionnaireRéseauValue?: string;
    zoneValue?: string;
  }
>;

export const registerInviterUseCase = () => {
  const runner: MessageHandler<InviterUtilisateurUseCase> = async ({
    identifiantUtilisateurValue,
    rôleValue,
    invitéLeValue,
    invitéParValue,
    fonctionValue: fonction,
    nomCompletValue: nomComplet,
    régionValue: région,
    identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
    zoneValue: zone,
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
        fonction,
        nomComplet,
        région,
        identifiantGestionnaireRéseau,
        zone,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.InviterUtilisateur', runner);
};
