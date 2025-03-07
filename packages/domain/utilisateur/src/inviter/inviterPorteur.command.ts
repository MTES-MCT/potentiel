import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type InviterPorteurCommand = Message<
  'Utilisateur.Command.InviterPorteur',
  {
    identifiantsProjet: IdentifiantProjet.ValueType[];
    identifiantUtilisateur: Email.ValueType;
    invitéPar: Email.ValueType;
    invitéLe: DateTime.ValueType;
  }
>;

export const registerInviterPorteurCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<InviterPorteurCommand> = async ({
    identifiantsProjet,
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur, false);

    await utilisateur.inviterPorteur({
      identifiantsProjet,
      identifiantUtilisateur,
      invitéLe,
      invitéPar,
    });
  };
  mediator.register('Utilisateur.Command.InviterPorteur', handler);
};
