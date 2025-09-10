import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ModifierInstallationAvecDispositifDeStockageCommand = Message<
  'Lauréat.InstallationAvecDispositifDeStockage.Command.ModifierInstallationAvecDispositifDeStockage',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    installationAvecDispositifDeStockage: boolean;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
  }
>;

export const registerModifierInstallationAvecDispositifDeStockageCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierInstallationAvecDispositifDeStockageCommand> = async (
    payload,
  ) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.installationAvecDispositifDeStockage.modifier(payload);
  };

  mediator.register(
    'Lauréat.InstallationAvecDispositifDeStockage.Command.ModifierInstallationAvecDispositifDeStockage',
    handler,
  );
};
