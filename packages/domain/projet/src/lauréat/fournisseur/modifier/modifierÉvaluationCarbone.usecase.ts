import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { ModifierÉvaluationCarboneCommand } from './modifierÉvaluationCarbone.command.js';

export type ModifierÉvaluationCarboneUseCase = Message<
  'Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone',
  {
    identifiantProjetValue: string;
    évaluationCarboneSimplifiéeValue: number;
    modifiéeLeValue: string;
    modifiéeParValue: string;
  }
>;

export const registerModifierÉvaluationCarboneUseCase = () => {
  const handler: MessageHandler<ModifierÉvaluationCarboneUseCase> = async ({
    identifiantProjetValue,
    modifiéeLeValue,
    modifiéeParValue,
    évaluationCarboneSimplifiéeValue,
  }) => {
    await mediator.send<ModifierÉvaluationCarboneCommand>({
      type: 'Lauréat.Fournisseur.Command.ModifierÉvaluationCarbone',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéeLe: DateTime.convertirEnValueType(modifiéeLeValue),
        modifiéePar: Email.convertirEnValueType(modifiéeParValue),
        évaluationCarboneSimplifiée: évaluationCarboneSimplifiéeValue,
      },
    });
  };

  mediator.register('Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone', handler);
};
