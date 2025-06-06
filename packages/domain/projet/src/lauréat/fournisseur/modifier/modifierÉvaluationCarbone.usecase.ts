import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

import { ModifierÉvaluationCarboneCommand } from './modifierÉvaluationCarbone.command';

export type ModifierÉvaluationCarboneUseCase = Message<
  'Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone',
  {
    identifiantProjetValue: string;
    évaluationCarboneSimplifiéeValue: number;
    modifiéLeValue: string;
    modifiéParValue: string;
  }
>;

export const registerModifierÉvaluationCarboneUseCase = () => {
  const handler: MessageHandler<ModifierÉvaluationCarboneUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    évaluationCarboneSimplifiéeValue,
  }) => {
    await mediator.send<ModifierÉvaluationCarboneCommand>({
      type: 'Lauréat.Fournisseur.Command.ModifierÉvaluationCarbone',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        évaluationCarboneSimplifiée: évaluationCarboneSimplifiéeValue,
      },
    });
  };

  mediator.register('Lauréat.Fournisseur.UseCase.ModifierÉvaluationCarbone', handler);
};
