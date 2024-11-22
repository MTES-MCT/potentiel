import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadReprésentantLégalFactory } from '../représentantLégal.aggregate';

export type ModifierReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nomReprésentantLégal: string;
    dateModification: DateTime.ValueType;
  }
>;

export const registerModifierReprésentantLégalCommand = (loadAggregate: LoadAggregate) => {
  const loadReprésentantLégal = loadReprésentantLégalFactory(loadAggregate);
  const handler: MessageHandler<ModifierReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nomReprésentantLégal,
    dateModification,
  }) => {
    const représentantLégal = await loadReprésentantLégal(identifiantProjet);

    await représentantLégal.modifier({
      identifiantProjet,
      identifiantUtilisateur,
      nomReprésentantLégal,
      dateModification,
    });
  };
  mediator.register('Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal', handler);
};
