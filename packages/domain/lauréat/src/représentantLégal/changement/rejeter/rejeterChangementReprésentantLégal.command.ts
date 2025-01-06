// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

// Package
import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';

export type RejeterChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
  {
    dateRejet: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetAutomatique: boolean;
  }
>;

export const registerRejeterChangementReprésentantLégalCommand = (loadAggregate: LoadAggregate) => {
  const load = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<RejeterChangementReprésentantLégalCommand> = async ({
    dateRejet,
    identifiantUtilisateur,
    identifiantProjet,
    rejetAutomatique,
  }) => {
    const représentantLégal = await load(identifiantProjet);

    await représentantLégal.rejeter({
      dateRejet,
      identifiantUtilisateur,
      identifiantProjet,
      rejetAutomatique,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
    handler,
  );
};
