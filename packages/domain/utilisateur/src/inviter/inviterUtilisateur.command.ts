import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregateV2 } from '@potentiel-domain/core';

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
    zone?: string;
  }
>;

export const registerInviterCommand = (loadAggregate: LoadAggregateV2) => {
  const handler: MessageHandler<InviterUtilisateurCommand> = async ({
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
    rôle,
    fonction,
    nomComplet,
    région,
    identifiantGestionnaireRéseau,
    zone,
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
      zone,
    });
  };
  mediator.register('Utilisateur.Command.InviterUtilisateur', handler);
};
