import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';
import type { DispositifDeStockage } from '../../index.js';

export type ModifierDispositifDeStockageCommand = Message<
  'Lauréat.Installation.Command.ModifierDispositifDeStockage',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dispositifDeStockage: DispositifDeStockage.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
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
