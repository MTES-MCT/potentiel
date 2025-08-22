import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../..';

export type RetirerAccèsProjetCommand = Message<
  'Projet.Accès.Command.RetirerAccèsProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    retiréLe: DateTime.ValueType;
    retiréPar: Email.ValueType;
    cause?: 'changement-producteur';
  }
>;

export const registerRetirerAccèsProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RetirerAccèsProjetCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.accès.retirer(payload);
  };
  mediator.register('Projet.Accès.Command.RetirerAccèsProjet', handler);
};
