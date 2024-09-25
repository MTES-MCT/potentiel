import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadÉliminéFactory } from '../éliminé.aggregate';

export type ArchiverÉliminéCommand = Message<
  'Éliminé.Recours.Command.ArchiverÉliminé',
  {
    dateArchive: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerArchiverÉliminéCommand = (loadAggregate: LoadAggregate) => {
  const loadÉliminé = loadÉliminéFactory(loadAggregate);
  const handler: MessageHandler<ArchiverÉliminéCommand> = async ({
    dateArchive,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const éliminé = await loadÉliminé(identifiantProjet);

    await éliminé.archiver({
      dateArchive,
      identifiantProjet,
      identifiantUtilisateur,
    });
  };
  mediator.register('Éliminé.Recours.Command.ArchiverÉliminé', handler);
};
