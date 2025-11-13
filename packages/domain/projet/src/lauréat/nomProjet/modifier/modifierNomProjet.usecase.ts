import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

import { ModifierNomProjetCommand } from './modifierNomProjet.command';

export type ModifierNomProjetUseCase = Message<
  'Lauréat.UseCase.ModifierNomProjet',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    nomProjetValue: string;
  }
>;

export const registerModifierNomProjetUseCase = () => {
  const handler: MessageHandler<ModifierNomProjetUseCase> = async ({
    identifiantProjetValue,
    nomProjetValue,
    modifiéLeValue,
    modifiéParValue,
  }) => {
    await mediator.send<ModifierNomProjetCommand>({
      type: 'Lauréat.Command.ModifierNomProjet',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        nomProjet: nomProjetValue,
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierNomProjet', handler);
};
