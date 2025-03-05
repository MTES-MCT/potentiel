import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';
import { Role } from '..';

export type InviterUtilisateurCommand = Message<
  'Utilisateur.Command.InviterUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    rôle: Role.ValueType;
    invitéLe: DateTime.ValueType;
    invitéPar: Email.ValueType;
    région?: string;
    identifiantGestionnaireRéseau?: string;
  }
>;

export const registerInviterCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<InviterUtilisateurCommand> = async ({
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
    rôle,
    région,
    identifiantGestionnaireRéseau,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur, false);

    await utilisateur.inviter({
      identifiantUtilisateur,
      rôle,
      invitéLe,
      invitéPar,
      région,
      identifiantGestionnaireRéseau,
    });
  };
  mediator.register('Utilisateur.Command.InviterUtilisateur', handler);
};
