import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';
import { Localité } from '../../candidature';

export type ModifierLauréatCommand = Message<
  'Lauréat.Command.ModifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    nomProjet: string;
    localité: Localité.ValueType;
  }
>;

export const registerModifierLauréatCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<ModifierLauréatCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.modifier(payload);
  };
  mediator.register('Lauréat.Command.ModifierLauréat', handler);
};
