import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadUtilisateurFactory } from '../utilisateur.aggregate';

export type RetirerAccèsProjetCommand = Message<
  'Utilisateur.Command.RetirerAccèsProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    retiréLe: DateTime.ValueType;
    retiréPar: Email.ValueType;
    cause?: 'changement-producteur';
  }
>;

export const registerRetirerAccèsProjetCommand = (loadAggregate: LoadAggregate) => {
  const loadUtilisateur = loadUtilisateurFactory(loadAggregate);

  const handler: MessageHandler<RetirerAccèsProjetCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    retiréLe,
    retiréPar,
    cause,
  }) => {
    const utilisateur = await loadUtilisateur(identifiantUtilisateur);
    const utilisateurNAPasAccèsAuProjet = !utilisateur.projets.has(identifiantProjet.formatter());

    await utilisateur.retirerAccèsProjet({
      identifiantProjet,
      identifiantUtilisateur,
      retiréLe,
      retiréPar,
      cause,
      utilisateurNAPasAccèsAuProjet,
    });
  };
  mediator.register('Utilisateur.Command.RetirerAccèsProjet', handler);
};
