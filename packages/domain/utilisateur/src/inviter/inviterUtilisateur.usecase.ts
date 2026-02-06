import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, DateTime } from '@potentiel-domain/common';

import { Utilisateur } from '../index.js';

import { InviterUtilisateurCommand } from './inviterUtilisateur.command.js';

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
    fonctionValue,
    nomCompletValue,
    régionValue,
    identifiantGestionnaireRéseauValue,
    zoneValue,
  }) => {
    const utilisateur = Utilisateur.convertirEnValueType({
      identifiantUtilisateur: identifiantUtilisateurValue,
      rôle: rôleValue,
      fonction: fonctionValue,
      nomComplet: nomCompletValue,
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseauValue,
      zone: zoneValue,
      région: régionValue,
    });
    const invitéLe = DateTime.convertirEnValueType(invitéLeValue);
    const invitéPar = Email.convertirEnValueType(invitéParValue);

    await mediator.send<InviterUtilisateurCommand>({
      type: 'Utilisateur.Command.InviterUtilisateur',
      data: {
        utilisateur,
        invitéLe,
        invitéPar,
      },
    });
  };

  mediator.register('Utilisateur.UseCase.InviterUtilisateur', runner);
};
