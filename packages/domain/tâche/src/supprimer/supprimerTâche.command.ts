import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâcheAggregateFactory } from '../tâche.aggregate';
import * as Tâche from '../typeTâche.valueType';

export type SupprimerTâcheCommand = Message<
  'SUPPRIMER_TÂCHE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâche: Tâche.ValueType;
  }
>;

export const registerSupprimerTâcheCommand = (loadAggregate: LoadAggregate) => {
  const loadTâche = loadTâcheAggregateFactory(loadAggregate);
  const handler: MessageHandler<SupprimerTâcheCommand> = async ({
    identifiantProjet,
    typeTâche,
  }) => {
    const tâche = await loadTâche(typeTâche, identifiantProjet);
    await tâche.ajouter({
      typeTâche,
      identifiantProjet,
    });
  };
  mediator.register('SUPPRIMER_TÂCHE_COMMAND', handler);
};
