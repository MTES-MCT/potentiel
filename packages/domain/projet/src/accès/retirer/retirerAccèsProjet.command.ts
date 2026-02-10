import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../index.js';

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
