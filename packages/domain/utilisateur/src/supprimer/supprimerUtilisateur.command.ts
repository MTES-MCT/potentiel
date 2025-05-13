import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type SupprimerUtilisateurCommand = Message<
  'Utilisateur.Command.SupprimerUtilisateur',
  {
    identifiantUtilisateur: Email.ValueType;
    suppriméPar: Email.ValueType;
    suppriméLe: DateTime.ValueType;
  }
>;

export const registerSupprimerCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<SupprimerUtilisateurCommand> = async ({
    identifiantUtilisateur,
    suppriméPar,
    suppriméLe,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur, false);

    await utilisateur.supprimer({
      identifiantUtilisateur,
      suppriméPar,
      suppriméLe,
    });
  };
  mediator.register('Utilisateur.Command.SupprimerUtilisateur', handler);
};
