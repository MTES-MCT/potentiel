import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { Role } from '..';
import { UtilisateurAggregate } from '../utilisateur.aggregate';

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
    const utilisateur = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateur.inviter({
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
