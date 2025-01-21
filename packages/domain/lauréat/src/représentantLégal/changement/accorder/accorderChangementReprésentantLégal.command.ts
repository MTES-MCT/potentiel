// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

// Package
import { loadReprésentantLégalFactory } from '../../représentantLégal.aggregate';
import { TypeReprésentantLégal } from '../..';

export type AccorderChangementReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  } & (
    | {
        nomReprésentantLégal: string;
        typeReprésentantLégal: TypeReprésentantLégal.ValueType;
        accordAutomatique: false;
      }
    | {
        accordAutomatique: true;
      }
  )
>;

export const registerAccorderChangementReprésentantLégalCommand = (
  loadAggregate: LoadAggregate,
) => {
  const load = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<AccorderChangementReprésentantLégalCommand> = async (options) => {
    const représentantLégal = await load(options.identifiantProjet);

    await représentantLégal.accorder(options);
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
    handler,
  );
};
