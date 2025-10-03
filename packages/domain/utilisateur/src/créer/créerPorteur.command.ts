import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

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
      invitéPar: Email.système,
    });
  };
  mediator.register('Utilisateur.Command.CréerPorteur', handler);
};
