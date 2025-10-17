import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregateV2 } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate';

export type InviterPorteurCommand = Message<
  'Utilisateur.Command.InviterPorteur',
  {
    identifiantsProjet: string[];
    identifiantUtilisateur: Email.ValueType;
    invitéPar: Email.ValueType;
    invitéLe: DateTime.ValueType;
  }
>;

export const registerInviterPorteurCommand = (loadAggregate: LoadAggregateV2) => {
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
