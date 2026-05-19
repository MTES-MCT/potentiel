import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import type { Utilisateur } from '../index.js';
import { UtilisateurAggregate } from '../utilisateur.aggregate.js';

export type InviterUtilisateurCommand = Message<
  'Utilisateur.Command.InviterUtilisateur',
  {
    utilisateur: Utilisateur.ValueType;
    invitéLe: DateTime.ValueType;
    invitéPar: Email.ValueType;
  }
>;

export const registerInviterCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<InviterUtilisateurCommand> = async ({
    invitéLe,
    invitéPar,
    utilisateur,
  }) => {
    const utilisateurAgg = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${utilisateur.identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateurAgg.inviter({
      invitéLe,
      invitéPar,
      utilisateur,
    });
  };
  mediator.register('Utilisateur.Command.InviterUtilisateur', handler);
};
