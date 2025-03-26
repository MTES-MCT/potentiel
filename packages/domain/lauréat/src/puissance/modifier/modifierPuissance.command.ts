import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadPuissanceFactory } from '../puissance.aggregate';

export type ModifierPuissanceCommand = Message<
  'Lauréat.Puissance.Command.ModifierPuissance',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    puissance: number;
    dateModification: DateTime.ValueType;
  }
>;

export const registerModifierPuissanceCommand = (loadAggregate: LoadAggregate) => {
  const loadPuissance = loadPuissanceFactory(loadAggregate);

  const handler: MessageHandler<ModifierPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    puissance,
    dateModification,
  }) => {
    const puissanceAggrégat = await loadPuissance(identifiantProjet);

    await puissanceAggrégat.modifier({
      identifiantProjet,
      identifiantUtilisateur,
      puissance,
      dateModification,
    });
  };
  mediator.register('Lauréat.Puissance.Command.ModifierPuissance', handler);
};
