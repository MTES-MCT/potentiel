import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregateV2 } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate';

export type CréerPorteurCommand = Message<
  'Utilisateur.Command.CréerPorteur',
  {
    identifiantUtilisateur: Email.ValueType;
    crééLe: DateTime.ValueType;
  }
>;

export const registerCréerPorteurCommand = (loadAggregate: LoadAggregateV2) => {
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
