import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../index.js';

export type RemplacerAccèsProjetCommand = Message<
  'Projet.Accès.Command.RemplacerAccèsProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nouvelIdentifiantUtilisateur: Email.ValueType;
    remplacéLe: DateTime.ValueType;
    remplacéPar: Email.ValueType;
  }
>;

export const registerRemplacerAccèsProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RemplacerAccèsProjetCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.accès.remplacer(payload);
  };
  mediator.register('Projet.Accès.Command.RemplacerAccèsProjet', handler);
};
