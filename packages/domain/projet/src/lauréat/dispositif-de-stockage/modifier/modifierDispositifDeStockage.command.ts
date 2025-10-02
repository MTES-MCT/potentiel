import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';
import { DispositifDeStockage } from '..';

export type ModifierDispositifDeStockageCommand = Message<
  'Lauréat.DispositifDeStockage.Command.ModifierDispositifDeStockage',
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
    await projet.lauréat.dispositifDeStockage.modifier(payload);
  };

  mediator.register('Lauréat.DispositifDeStockage.Command.ModifierDispositifDeStockage', handler);
};
