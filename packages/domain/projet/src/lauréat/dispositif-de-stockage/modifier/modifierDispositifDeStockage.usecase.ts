import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';
import { DispositifDeStockage } from '..';

import { ModifierDispositifDeStockageCommand } from './modifierDispositifDeStockage.command';

export type ModifierDispositifDeStockageUseCase = Message<
  'Lauréat.DispositifDeStockage.UseCase.ModifierDispositifDeStockage',
  {
    identifiantProjetValue: string;
    dispositifDeStockageValue: DispositifDeStockage.RawType;
    modifiéLeValue: string;
    modifiéParValue: string;
  }
>;

export const registerModifierDispositifDeStockageUseCase = () => {
  const handler: MessageHandler<ModifierDispositifDeStockageUseCase> = async ({
    identifiantProjetValue,
    modifiéLeValue,
    modifiéParValue,
    dispositifDeStockageValue,
  }) => {
    await mediator.send<ModifierDispositifDeStockageCommand>({
      type: 'Lauréat.DispositifDeStockage.Command.ModifierDispositifDeStockage',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéLe: DateTime.convertirEnValueType(modifiéLeValue),
        modifiéPar: Email.convertirEnValueType(modifiéParValue),
        dispositifDeStockage: DispositifDeStockage.bind(dispositifDeStockageValue),
      },
    });
  };

  mediator.register('Lauréat.DispositifDeStockage.UseCase.ModifierDispositifDeStockage', handler);
};
