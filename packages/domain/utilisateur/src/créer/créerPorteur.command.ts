import { type Message, type MessageHandler, mediator } from 'mediateur';

import { type DateTime, Email } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type CréerPorteurCommand = Message<
  'Utilisateur.Command.CréerPorteur',
  {
    identifiantUtilisateur: Email.ValueType;
    crééLe: DateTime.ValueType;
  }
>;

export const registerCréerPorteurCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<CréerPorteurCommand> = async ({
    identifiantUtilisateur,
    crééLe,
  }) => {
    const utilisateurInvité = await loadUtilisateur(identifiantUtilisateur, false);

    await utilisateurInvité.inviterPorteur({
      identifiantsProjet: [],
      identifiantUtilisateur,
      invitéLe: crééLe,
      invitéPar: Email.system(),
    });
  };
  mediator.register('Utilisateur.Command.CréerPorteur', handler);
};
