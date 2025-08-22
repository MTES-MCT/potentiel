import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { LoadAggregate } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type * as Tâche from '../typeTâche.valueType';
import { loadTâcheAggregateFactory } from '../tâche.aggregate';

export type AcheverTâcheCommand = Message<
  'System.Tâche.Command.AcheverTâche',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâche: Tâche.ValueType;
  }
>;

export const registerAcheverTâcheCommand = (loadAggregate: LoadAggregate) => {
  const loadTâche = loadTâcheAggregateFactory(loadAggregate);
  const handler: MessageHandler<AcheverTâcheCommand> = async ({ identifiantProjet, typeTâche }) => {
    const tâche = await loadTâche(typeTâche, identifiantProjet, false);
    await tâche.achever({
      identifiantProjet,
    });
  };
  mediator.register('System.Tâche.Command.AcheverTâche', handler);
};
