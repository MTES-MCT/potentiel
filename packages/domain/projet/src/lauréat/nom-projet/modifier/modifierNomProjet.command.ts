import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ModifierNomProjetCommand = Message<
  'Lauréat.Command.ModifierNomProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    nomProjet: string;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
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
