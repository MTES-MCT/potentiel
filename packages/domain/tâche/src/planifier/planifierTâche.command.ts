import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadTâcheAggregateFactory } from '../tâche.aggregate';
import * as Tâche from '../typeTâche.valueType';

export type PlanifierTâcheCommand = Message<
  'System.Tâche.Command.PlanifierTâche',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâche: Tâche.ValueType;
    àExecuterLe: DateTime.ValueType;
  }
>;

export const registerPlanifierTâcheCommand = (loadAggregate: LoadAggregate) => {
  const loadTâche = loadTâcheAggregateFactory(loadAggregate);
  const handler: MessageHandler<PlanifierTâcheCommand> = async ({
    identifiantProjet,
    typeTâche,
    àExecuterLe,
  }) => {
    const tâche = await loadTâche(typeTâche, identifiantProjet, false);
    await tâche.planifier({
      typeTâche,
      identifiantProjet,
      àExecuterLe,
    });
  };
  mediator.register('System.Tâche.Command.PlanifierTâche', handler);
};
