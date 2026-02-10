import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ExécuterTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.ExécuterTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâchePlanifiée: string;
    exécutéeLe: DateTime.ValueType;
  }
>;

export const registerExécuterTâchePlanifiéeCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ExécuterTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    typeTâchePlanifiée,
    exécutéeLe,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    const tâchePlanifiée = await projet.lauréat.loadTâchePlanifiée(typeTâchePlanifiée);
    await tâchePlanifiée.exécuter({ exécutéeLe });
  };
  mediator.register('System.TâchePlanifiée.Command.ExécuterTâchePlanifiée', handler);
};
