// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

// Package
import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '../..';

export type AccorderChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
  {
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderChangementReprésentantLégalCommand = (
  loadAggregate: LoadAggregate,
) => {
  const load = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<AccorderChangementReprésentantLégalCommand> = async ({
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const représentantLégal = await load(identifiantProjet);

    await représentantLégal.accorder({
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateAccord,
      identifiantUtilisateur,
      identifiantProjet,
      réponseSignée,
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
    handler,
  );
};
