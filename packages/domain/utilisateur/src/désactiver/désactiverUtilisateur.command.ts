import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type DésactiverUtilisateurCommand = Message<
  'Utilisateur.Command.DésactiverUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    désactivéPar: Email.ValueType;
    désactivéLe: DateTime.ValueType;
  }
>;

export const registerDésactiverCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<DésactiverUtilisateurCommand> = async ({
    identifiantUtilisateur,
    désactivéPar,
    désactivéLe,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur);

    await utilisateur.désactiver({
      identifiantUtilisateur,
      désactivéPar,
      désactivéLe,
    });
  };
  mediator.register('Utilisateur.Command.DésactiverUtilisateur', handler);
};
