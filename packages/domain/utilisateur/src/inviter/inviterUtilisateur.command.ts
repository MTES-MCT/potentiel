import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import type { Role } from '..';
import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type InviterUtilisateurCommand = Message<
  'Utilisateur.Command.InviterUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    rôle: Role.ValueType;
    invitéLe: DateTime.ValueType;
    invitéPar: Email.ValueType;
    fonction?: string;
    nomComplet?: string;
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
    fonction,
    nomComplet,
    région,
    identifiantGestionnaireRéseau,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur, false);

    await utilisateur.inviter({
      identifiantUtilisateur,
      rôle,
      invitéLe,
      invitéPar,
      fonction,
      nomComplet,
      région,
      identifiantGestionnaireRéseau,
    });
  };
  mediator.register('Utilisateur.Command.InviterUtilisateur', handler);
};
