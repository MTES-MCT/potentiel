import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadReprésentantLégalFactory } from '../représentantLégal.aggregate';

export type CorrigerReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.CorrigerReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nomReprésentantLégal: string;
    dateCorrection: DateTime.ValueType;
  }
>;

export const registerCorrigerReprésentantLégalCommand = (loadAggregate: LoadAggregate) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<CorrigerReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nomReprésentantLégal,
    dateCorrection,
  }) => {
    const représentantLégal = await loadReprésentantLégal(identifiantProjet, false);

    await représentantLégal.corriger({
      identifiantProjet,
      identifiantUtilisateur,
      nomReprésentantLégal,
      dateCorrection,
    });
  };
  mediator.register('Lauréat.ReprésentantLégal.Command.CorrigerReprésentantLégal', handler);
};
