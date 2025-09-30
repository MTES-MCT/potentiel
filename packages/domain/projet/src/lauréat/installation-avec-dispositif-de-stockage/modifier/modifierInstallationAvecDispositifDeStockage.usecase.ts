import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

import { ModifierInstallationAvecDispositifDeStockageCommand } from './modifierInstallationAvecDispositifDeStockage.command';
import { DispositifDeStockage } from '..';

export type ModifierInstallationAvecDispositifDeStockageUseCase = Message<
  'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
  {
    identifiantProjetValue: string;
    // installationAvecDispositifDeStockageValue: boolean;
    dispositifDeStockageValue: DispositifDeStockage.RawType;
    modifiéeLeValue: string;
    modifiéeParValue: string;
  }
>;

export const registerModifierInstallationAvecDispositifDeStockageUseCase = () => {
  const handler: MessageHandler<ModifierInstallationAvecDispositifDeStockageUseCase> = async ({
    identifiantProjetValue,
    modifiéeLeValue,
    modifiéeParValue,
    // installationAvecDispositifDeStockageValue,
    dispositifDeStockageValue,
  }) => {
    await mediator.send<ModifierInstallationAvecDispositifDeStockageCommand>({
      type: 'Lauréat.InstallationAvecDispositifDeStockage.Command.ModifierInstallationAvecDispositifDeStockage',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéeLe: DateTime.convertirEnValueType(modifiéeLeValue),
        modifiéePar: Email.convertirEnValueType(modifiéeParValue),
        // installationAvecDispositifDeStockage: installationAvecDispositifDeStockageValue,
        dispositifDeStockage: DispositifDeStockage.bind(dispositifDeStockageValue),
      },
    });
  };

  mediator.register(
    'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
    handler,
  );
};
