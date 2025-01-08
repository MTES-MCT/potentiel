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
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    dateRejet: DateTime.ValueType;
    motifRejet: string;
    rejetAutomatique: boolean;
  }
>;

export const registerRejeterChangementReprésentantLégalCommand = (loadAggregate: LoadAggregate) => {
  const load = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<RejeterChangementReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    dateRejet,
    motifRejet,
    rejetAutomatique,
  }) => {
    const représentantLégal = await load(identifiantProjet);

    await représentantLégal.rejeter({
      identifiantProjet,
      identifiantUtilisateur,
      dateRejet,
      motifRejet,
      rejetAutomatique,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.RejeterChangementReprésentantLégal',
    handler,
  );
};
