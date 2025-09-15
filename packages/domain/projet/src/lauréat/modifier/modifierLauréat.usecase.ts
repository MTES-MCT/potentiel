import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { Localité } from '../../candidature';

import { ModifierLauréatCommand } from './modifierLauréat.command';

export type ModifierLauréatUseCase = Message<
  'Lauréat.UseCase.ModifierLauréat',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    nomProjetValue: string;
    localitéValue: Localité.RawType;
  }
>;

export const registerModifierLauréatUseCase = () => {
  const handler: MessageHandler<ModifierLauréatUseCase> = async ({
    identifiantProjetValue,
    nomProjetValue,
    modifiéLeValue,
    modifiéParValue,
    localitéValue,
  }) => {
    await mediator.send<ModifierLauréatCommand>({
      type: 'Lauréat.Command.ModifierLauréat',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        nomProjet: nomProjetValue,
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        localité: Localité.bind(localitéValue),
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierLauréat', handler);
};
