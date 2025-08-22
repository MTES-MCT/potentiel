import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { IdentifiantProjet } from '../..';
import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

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
