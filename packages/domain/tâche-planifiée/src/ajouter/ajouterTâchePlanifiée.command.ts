import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as TâchePlanifiée from '../typeTâchePlanifiée.valueType';
import { loadTâchePlanifiéeAggregateFactory } from '../tâchePlanifiée.aggregate';

export type AjouterTâchePlanifiéeCommand = Message<
  'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâchePlanifiée: TâchePlanifiée.ValueType;
    àExecuterLe: DateTime.ValueType;
  }
>;

export const registerAjouterTâchePlanifiéeCommand = (loadAggregate: LoadAggregate) => {
  const loadTâchePlanifiée = loadTâchePlanifiéeAggregateFactory(loadAggregate);
  const handler: MessageHandler<AjouterTâchePlanifiéeCommand> = async ({
    identifiantProjet,
    typeTâchePlanifiée,
    àExecuterLe,
  }) => {
    const tâche = await loadTâchePlanifiée(typeTâchePlanifiée, identifiantProjet, false);
    await tâche.ajouter({
      typeTâchePlanifiée,
      identifiantProjet,
      àExecuterLe,
    });
  };
  mediator.register('System.TâchePlanifiée.Command.AjouterTâchePlanifiée', handler);
};
