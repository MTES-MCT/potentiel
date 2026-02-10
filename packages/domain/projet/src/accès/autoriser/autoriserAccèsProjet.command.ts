import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../index.js';

export type AutoriserAccèsProjetCommand = Message<
  'Projet.Accès.Command.AutoriserAccèsProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    autoriséLe: DateTime.ValueType;
    autoriséPar: Email.ValueType;
    raison: 'invitation' | 'notification' | 'réclamation';
  }
>;

export const registerAutoriserAccèsProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AutoriserAccèsProjetCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.accès.autoriser(payload);
  };
  mediator.register('Projet.Accès.Command.AutoriserAccèsProjet', handler);
};
