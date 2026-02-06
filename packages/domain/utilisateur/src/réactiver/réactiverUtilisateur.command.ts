import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { UtilisateurAggregate } from '../utilisateur.aggregate.js';

export type RéactiverUtilisateurCommand = Message<
  'Utilisateur.Command.RéactiverUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    réactivéPar: Email.ValueType;
    réactivéLe: DateTime.ValueType;
  }
>;

export const registerRéactiverCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<RéactiverUtilisateurCommand> = async ({
    identifiantUtilisateur,
    réactivéPar,
    réactivéLe,
  }) => {
    const utilisateur = await loadAggregate(
      UtilisateurAggregate,
      `utilisateur|${identifiantUtilisateur.formatter()}`,
      undefined,
    );

    await utilisateur.réactiver({
      réactivéPar,
      réactivéLe,
    });
  };
  mediator.register('Utilisateur.Command.RéactiverUtilisateur', handler);
};
