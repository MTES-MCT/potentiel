import { Message, MessageHandler, mediator } from 'mediateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ExécuterTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.ExécuterTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâchePlanifiée: string;
  }
>;

export const registerExécuterTâchePlanifiéeCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ExécuterTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    typeTâchePlanifiée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    const tâchePlanifiée = await projet.lauréat.loadTâchePlanifiée(typeTâchePlanifiée);
    await tâchePlanifiée.exécuter();
  };
  mediator.register('System.TâchePlanifiée.Command.ExécuterTâchePlanifiée', handler);
};
