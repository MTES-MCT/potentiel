import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';

export type ModifierNomProjetCommand = Message<
  'Lauréat.Command.ModifierNomProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    nomProjet: string;
  }
>;

export const registerModifierNomProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierNomProjetCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.modifierNomProjet(payload);
  };
  mediator.register('Lauréat.Command.ModifierNomProjet', handler);
};
