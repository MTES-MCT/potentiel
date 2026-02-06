import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate.js';

export type CréerPorteurCommand = Message<
  'Utilisateur.Command.CréerPorteur',
  {
    identifiantUtilisateur: Email.ValueType;
    crééLe: DateTime.ValueType;
  }
>;

export const registerCréerPorteurCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<CréerPorteurCommand> = async ({
    identifiantUtilisateur,
    crééLe,
  }) => {
    const utilisateurInvité = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateurInvité.inviterPorteur({
      identifiantsProjet: [],
      invitéLe: crééLe,
      invitéPar: Email.système,
    });
  };
  mediator.register('Utilisateur.Command.CréerPorteur', handler);
};
