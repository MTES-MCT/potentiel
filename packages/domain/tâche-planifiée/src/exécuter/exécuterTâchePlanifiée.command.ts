import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
import { loadTâchePlanifiéeAggregateFactory } from '../tâchePlanifiée.aggregate';

export type ExécuterTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.ExécuterTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâchePlanifiée: TâchePlanifiée.ValueType;
  }
>;

export const registerExécuterTâchePlanifiéeCommand = (loadAggregate: LoadAggregate) => {
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);
  const handler: MessageHandler<ExécuterTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    typeTâchePlanifiée,
  }) => {
    const tâche = await loadTâchePlanifiée(typeTâchePlanifiée, identifiantProjet, false);
    await tâche.exécuter({
      typeTâchePlanifiée,
      identifiantProjet,
    });
  };
  mediator.register('System.TâchePlanifiée.Command.ExécuterTâchePlanifiée', handler);
};
