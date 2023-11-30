import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâcheAggregateFactory } from '../tâche.aggregate';
import * as Tâche from '../typeTâche.valueType';

export type AjouterTâcheCommand = Message<
  'AJOUTER_TÂCHE_COMMAND',
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
  mediator.register('AJOUTER_TÂCHE_COMMAND', handler);
};
