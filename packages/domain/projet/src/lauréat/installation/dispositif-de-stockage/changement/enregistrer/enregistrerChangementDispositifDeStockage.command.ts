import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DispositifDeStockage } from '../../../index.js';
import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../../../index.js';

export type EnregistrerChangementDispositifDeStockageCommand = Message<
  'Lauréat.Installation.Command.EnregistrerChangementDispositifDeStockage',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dispositifDeStockage: DispositifDeStockage.ValueType;
    enregistréLe: DateTime.ValueType;
    enregistréPar: Email.ValueType;
    pièceJustificative: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerEnregistrerChangementDispositifDeStockageCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementDispositifDeStockageCommand> = async (
    payload,
  ) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.installation.enregistrerChangementDispositifDeStockage(payload);
  };

  mediator.register(
    'Lauréat.Installation.Command.EnregistrerChangementDispositifDeStockage',
    handler,
  );
};
