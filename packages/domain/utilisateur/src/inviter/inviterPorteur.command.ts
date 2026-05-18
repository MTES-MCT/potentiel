import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate.js';

export type InviterPorteurCommand = Message<
  'Utilisateur.Command.InviterPorteur',
  {
    identifiantsProjet: string[];
    identifiantUtilisateur: Email.ValueType;
    invitéPar: Email.ValueType;
    invitéLe: DateTime.ValueType;
  }
>;

export const registerInviterPorteurCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<InviterPorteurCommand> = async ({
    identifiantsProjet,
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
  }) => {
    const utilisateurInvité = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateurInvité.inviterPorteur({
      identifiantsProjet,
      invitéLe,
      invitéPar,
    });
  };
  mediator.register('Utilisateur.Command.InviterPorteur', handler);
};
