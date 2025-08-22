import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';
import type { TypeReprésentantLégal } from '..';

export type ModifierReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    dateModification: DateTime.ValueType;
  }
>;

export const registerModifierReprésentantLégalCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierReprésentantLégalCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nomReprésentantLégal,
    typeReprésentantLégal,
    dateModification,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.représentantLégal.modifier({
      identifiantUtilisateur,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateModification,
    });
  };
  mediator.register('Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal', handler);
};
