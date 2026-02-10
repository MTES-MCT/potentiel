import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ModifierÉvaluationCarboneCommand = Message<
  'Lauréat.Fournisseur.Command.ModifierÉvaluationCarbone',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    évaluationCarboneSimplifiée: number;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
  }
>;

export const registerModifierÉvaluationCarboneCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierÉvaluationCarboneCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.fournisseur.modifierÉvaluationCarbone(payload);
  };

  mediator.register('Lauréat.Fournisseur.Command.ModifierÉvaluationCarbone', handler);
};
