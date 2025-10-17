import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregateV2 } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate';

export type DésactiverUtilisateurCommand = Message<
  'Utilisateur.Command.DésactiverUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    désactivéPar: Email.ValueType;
    désactivéLe: DateTime.ValueType;
  }
>;

export const registerDésactiverCommand = (loadAggregate: LoadAggregateV2) => {
  const handler: MessageHandler<DésactiverUtilisateurCommand> = async ({
    identifiantUtilisateur,
    désactivéPar,
    désactivéLe,
  }) => {
    const utilisateur = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${identifiantUtilisateur.formatter()}`,
      undefined,
    );
    await utilisateur.désactiver({
      désactivéPar,
      désactivéLe,
    });
  };
  mediator.register('Utilisateur.Command.DésactiverUtilisateur', handler);
};
