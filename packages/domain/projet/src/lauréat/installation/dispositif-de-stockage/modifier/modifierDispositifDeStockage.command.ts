import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DispositifDeStockage } from '../..';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierDispositifDeStockageCommand = Message<
  'Lauréat.Installation.Command.ModifierDispositifDeStockage',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dispositifDeStockage: DispositifDeStockage.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
  }
>;

export const registerModifierDispositifDeStockageCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierDispositifDeStockageCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.installation.modifierDispositifDeStockage(payload);
  };

  mediator.register('Lauréat.Installation.Command.ModifierDispositifDeStockage', handler);
};
