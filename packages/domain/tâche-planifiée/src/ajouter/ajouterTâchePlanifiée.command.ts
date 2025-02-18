import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadTâchePlanifiéeAggregateFactory } from '../tâchePlanifiée.aggregate';

export type AjouterTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    tâches: Array<{
      typeTâchePlanifiée: string;
      àExécuterLe: DateTime.ValueType;
    }>;
  }
>;

export const registerAjouterTâchePlanifiéeCommand = (loadAggregate: LoadAggregate) => {
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);
  const handler: MessageHandler<AjouterTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    tâches,
  }) => {
    await Promise.all(
      tâches.map(async ({ typeTâchePlanifiée, àExécuterLe }) => {
        const tâche = await loadTâchePlanifiée(typeTâchePlanifiée, identifiantProjet, false);
        await tâche.ajouter({
          àExécuterLe,
        });
      }),
    );
  };
  mediator.register('System.TâchePlanifiée.Command.AjouterTâchePlanifiée', handler);
};
