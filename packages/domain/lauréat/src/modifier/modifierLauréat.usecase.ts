import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ModifierLauréatCommand } from './modifierLauréat.command';

export type ModifierLauréatUseCase = Message<
  'Lauréat.UseCase.ModifierLauréat',
  {
    identifiantProjetValue: string;
    nomProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    localité: {
      adresse1: string;
      adresse2: string;
      codePostal: string;
      commune: string;
      département: string;
      région: string;
    };
  }
>;

export const registerModifierLauréatUseCase = () => {
  const handler: MessageHandler<ModifierLauréatUseCase> = async ({
    identifiantProjetValue,
    nomProjetValue,
    modifiéLeValue,
    modifiéParValue,
    localité,
  }) => {
    await mediator.send<ModifierLauréatCommand>({
      type: 'Lauréat.Command.ModifierLauréat',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        nomProjet: nomProjetValue,
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        localité,
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierLauréat', handler);
};
