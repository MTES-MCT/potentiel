import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type RéactiverUtilisateurCommand = Message<
  'Utilisateur.Command.RéactiverUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    réactivéPar: Email.ValueType;
    réactivéLe: DateTime.ValueType;
  }
>;

export const registerRéactiverCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<RéactiverUtilisateurCommand> = async ({
    identifiantUtilisateur,
    réactivéPar,
    réactivéLe,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur);

    await utilisateur.réactiver({
      identifiantUtilisateur,
      réactivéPar,
      réactivéLe,
    });
  };
  mediator.register('Utilisateur.Command.RéactiverUtilisateur', handler);
};
