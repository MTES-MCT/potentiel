import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { LoadAggregate } from '@potentiel-domain/core';
import type { IdentifiantProjet } from '@potentiel-domain/projet';

import type * as Tâche from '../typeTâche.valueType';
import { loadTâcheAggregateFactory } from '../tâche.aggregate';

export type AjouterTâcheCommand = Message<
  'System.Tâche.Command.AjouterTâche',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâche: Tâche.ValueType;
  }
>;

export const registerAjouterTâcheCommand = (loadAggregate: LoadAggregate) => {
  const loadTâche = loadTâcheAggregateFactory(loadAggregate);
  const handler: MessageHandler<AjouterTâcheCommand> = async ({ identifiantProjet, typeTâche }) => {
    const tâche = await loadTâche(typeTâche, identifiantProjet, false);
    await tâche.ajouter({
      typeTâche,
      identifiantProjet,
    });
  };
  mediator.register('System.Tâche.Command.AjouterTâche', handler);
};
