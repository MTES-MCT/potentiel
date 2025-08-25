import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type AjouterTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâchePlanifiée: string;
    àExécuterLe: DateTime.ValueType;
  }
>;

export const registerAjouterTâchePlanifiéeCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AjouterTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    typeTâchePlanifiée,
    àExécuterLe,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    const tâchePlanifiée = await projet.lauréat.loadTâchePlanifiée(typeTâchePlanifiée);
    await tâchePlanifiée.ajouter({ àExécuterLe });
  };
  mediator.register('System.TâchePlanifiée.Command.AjouterTâchePlanifiée', handler);
};
