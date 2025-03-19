import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../..';

export type ArchiverÉliminéCommand = Message<
  'Éliminé.Recours.Command.ArchiverÉliminé',
  {
    dateArchive: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerArchiverÉliminéCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<ArchiverÉliminéCommand> = async ({
    dateArchive,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.archiver({
      dateArchive,
      identifiantUtilisateur,
    });
  };
  mediator.register('Éliminé.Recours.Command.ArchiverÉliminé', handler);
};
