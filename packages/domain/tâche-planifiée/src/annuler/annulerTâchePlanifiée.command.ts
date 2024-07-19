import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
import { loadTâchePlanifiéeAggregateFactory } from '../tâchePlanifiée.aggregate';

export type AnnulerTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.AnnulerTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâchePlanifiée: TâchePlanifiée.ValueType;
  }
>;

export const registerAnnulerTâchePlanifiéeCommand = (loadAggregate: LoadAggregate) => {
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);
  const handler: MessageHandler<AnnulerTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    typeTâchePlanifiée,
  }) => {
    const tâche = await loadTâchePlanifiée(typeTâchePlanifiée, identifiantProjet, false);
    await tâche.annuler({
      typeTâchePlanifiée,
      identifiantProjet,
    });
  };
  mediator.register('System.TâchePlanifiée.Command.AnnulerTâchePlanifiée', handler);
};
