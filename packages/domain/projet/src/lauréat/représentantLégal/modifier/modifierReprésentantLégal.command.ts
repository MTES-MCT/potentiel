import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';
import { TypeReprésentantLégal } from '..';

export type ModifierReprésentantLégalCommand = Message<
  'Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nomReprésentantLégal: string;
    typeReprésentantLégal: TypeReprésentantLégal.ValueType;
    dateModification: DateTime.ValueType;
    raison?: string;
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
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.représentantLégal.modifier({
      identifiantUtilisateur,
      nomReprésentantLégal,
      typeReprésentantLégal,
      dateModification,
      raison,
    });
  };
  mediator.register('Lauréat.ReprésentantLégal.Command.ModifierReprésentantLégal', handler);
};
