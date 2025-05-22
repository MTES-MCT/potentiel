import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';

export type AutoriserAccèsProjetCommand = Message<
  'Projet.Accès.Command.AutoriserAccèsProjet',
  {
    identifiantProjets: Array<IdentifiantProjet.ValueType>;
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
    for (const identifiantProjet of payload.identifiantProjets) {
      const projet = await getProjetAggregateRoot(identifiantProjet);
      await projet.accès.autoriser(payload);
    }
  };
  mediator.register('Projet.Accès.Command.AutoriserAccèsProjet', handler);
};
