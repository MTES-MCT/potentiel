import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ModifierÉvaluationCarboneCommand = Message<
  'Lauréat.Fournisseur.Command.ModifierÉvaluationCarbone',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    évaluationCarboneSimplifiée: number;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
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
