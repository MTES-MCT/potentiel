import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type RéclamerProjetCommand = Message<
  'Utilisateur.Command.RéclamerProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    réclaméLe: DateTime.ValueType;
  }
>;

export const registerRéclamerProjetCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);
  const handler: MessageHandler<RéclamerProjetCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    réclaméLe,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur, false);
    // const utilisateur = await Ca loadCandidature(identifiantUtilisateur);

    await utilisateur.réclamer({
      identifiantProjet,
      identifiantUtilisateur,
      réclaméLe,
    });
  };
  mediator.register('Utilisateur.Command.RéclamerProjet', handler);
};
