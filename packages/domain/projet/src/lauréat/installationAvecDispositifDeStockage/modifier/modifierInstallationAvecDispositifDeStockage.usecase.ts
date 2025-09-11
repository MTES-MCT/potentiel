import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

import { ModifierInstallationAvecDispositifDeStockageCommand } from './modifierInstallationAvecDispositifDeStockage.command';

export type ModifierInstallationAvecDispositifDeStockageUseCase = Message<
  'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
  {
    identifiantProjetValue: string;
    installationAvecDispositifDeStockageValue: boolean;
    modifiéeLeValue: string;
    modifiéeParValue: string;
  }
>;

export const registerModifierInstallationAvecDispositifDeStockageUseCase = () => {
  const handler: MessageHandler<ModifierInstallationAvecDispositifDeStockageUseCase> = async ({
    identifiantProjetValue,
    modifiéeLeValue,
    modifiéeParValue,
    installationAvecDispositifDeStockageValue,
  }) => {
    await mediator.send<ModifierInstallationAvecDispositifDeStockageCommand>({
      type: 'Lauréat.InstallationAvecDispositifDeStockage.Command.ModifierInstallationAvecDispositifDeStockage',
      data: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
        modifiéeLe: DateTime.convertirEnValueType(modifiéeLeValue),
        modifiéePar: Email.convertirEnValueType(modifiéeParValue),
        installationAvecDispositifDeStockage: installationAvecDispositifDeStockageValue,
      },
    });
  };

  mediator.register(
    'Lauréat.InstallationAvecDispositifDeStockage.UseCase.ModifierInstallationAvecDispositifDeStockage',
    handler,
  );
};
