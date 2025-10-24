import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { Role, Région, Zone } from '..';

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
    régionValue,
    identifiantGestionnaireRéseauValue: identifiantGestionnaireRéseau,
    zoneValue,
  }) => {
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const rôle = Role.convertirEnValueType(rôleValue);
    const invitéLe = DateTime.convertirEnValueType(invitéLeValue);
    const invitéPar = Email.convertirEnValueType(invitéParValue);
    const région = régionValue ? Région.convertirEnValueType(régionValue) : undefined;
    const zone = zoneValue ? Zone.convertirEnValueType(zoneValue) : undefined;

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
