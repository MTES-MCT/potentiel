import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { loadLauréatFactory } from '../lauréat.aggregate';

export type ModifierLauréatCommand = Message<
  'Lauréat.Command.ModifierLauréat',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    nomProjet: string;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    localité: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      région: string;
      département: string;
    };
  }
>;

export const registerModifierLauréatCommand = (loadAggregate: LoadAggregate) => {
  const loadLauréatAggregate = loadLauréatFactory(loadAggregate);

  const handler: MessageHandler<ModifierLauréatCommand> = async (payload) => {
    const lauréat = await loadLauréatAggregate(payload.identifiantProjet, false);

    await lauréat.modifier(payload);
  };
  mediator.register('Lauréat.Command.ModifierLauréat', handler);
};
