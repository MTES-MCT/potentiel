import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';
import { StatutLauréat } from '..';

import { ModifierStatutLauréatCommand } from './modifierStatutLauréat.command';

export type ModifierStatutLauréatUseCase = Message<
  'Lauréat.UseCase.ModifierStatut',
  {
    identifiantProjetValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
    statutValue: StatutLauréat.RawType;
  }
>;

export const registerModifierStatutLauréatUseCase = () => {
  const handler: MessageHandler<ModifierStatutLauréatUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    statutValue,
  }) => {
    await mediator.send<ModifierStatutLauréatCommand>({
      type: 'Lauréat.Command.ModifierStatut',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        statut: StatutLauréat.convertirEnValueType(statutValue),
      },
    });
  };

  mediator.register('Lauréat.UseCase.ModifierStatut', handler);
};
