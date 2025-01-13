import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';

export type SupprimerChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.SupprimerChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    dateSuppression: DateTime.ValueType;
  }
>;

export const registerSupprimerChangementReprésentantLégalCommand = (
  loadAggregate: LoadAggregate,
) => {
  const load = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<SupprimerChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateSuppression,
  }) => {
    const représentantLégal = await load(identifiantProjet);

    await représentantLégal.supprimer({
      identifiantProjet,
      identifiantUtilisateur,
      dateSuppression,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.SupprimerChangementReprésentantLégal',
    handler,
  );
};
