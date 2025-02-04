import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

import { IdentifiantProjet, ProjetAggregateRoot } from '../..';

export type ArchiverÉliminéCommand = Message<
  'Éliminé.Recours.Command.ArchiverÉliminé',
  {
    dateArchive: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerArchiverÉliminéCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<ArchiverÉliminéCommand> = async ({
    dateArchive,
    identifiantUtilisateur,
    identifiantProjet,
  }) => {
    const projet = await ProjetAggregateRoot.get(identifiantProjet, loadAggregate);

    return projet.éliminé.archiver({
      dateArchive,
      identifiantProjet,
      identifiantUtilisateur,
    });
  };
  mediator.register('Éliminé.Recours.Command.ArchiverÉliminé', handler);
};
