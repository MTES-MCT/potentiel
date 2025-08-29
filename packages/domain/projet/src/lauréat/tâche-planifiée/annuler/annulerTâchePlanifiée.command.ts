import { Message, MessageHandler, mediator } from 'mediateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type AnnulerTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâchePlanifiée: string;
  }
>;

export const registerAnnulerTâchePlanifiéeCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AnnulerTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    typeTâchePlanifiée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    const tâchePlanifiée = await projet.lauréat.loadTâchePlanifiée(typeTâchePlanifiée);
    await tâchePlanifiée.annuler();
  };
  mediator.register('System.TâchePlanifiée.Command.AnnulerTâchePlanifiée', handler);
};
