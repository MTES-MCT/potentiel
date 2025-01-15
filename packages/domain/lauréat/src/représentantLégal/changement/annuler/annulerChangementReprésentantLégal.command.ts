// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

// Package
import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';

export type AnnulerChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    dateAnnulation: DateTime.ValueType;
  }
>;

export const registerAnnulerChangementReprésentantLégalCommand = (loadAggregate: LoadAggregate) => {
  const load = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<AnnulerChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateAnnulation,
  }) => {
    const représentantLégal = await load(identifiantProjet);

    await représentantLégal.annuler({
      identifiantProjet,
      identifiantUtilisateur,
      dateAnnulation,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.AnnulerChangementReprésentantLégal',
    handler,
  );
};
