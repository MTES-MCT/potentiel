import { Message, MessageHandler, mediator } from 'mediateur';

import * as Tâche from '../typeTâche.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type AcheverTâcheCommand = Message<
  'System.Tâche.Command.AcheverTâche',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâche: Tâche.ValueType;
  }
>;

export type AcheverTâcheCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAcheverTâcheCommand = ({
  getProjetAggregateRoot,
}: AcheverTâcheCommandDependencies) => {
  const handler: MessageHandler<AcheverTâcheCommand> = async ({ identifiantProjet, typeTâche }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    const tâche = await projet.lauréat.loadTâche(typeTâche.type);

    await tâche.achever();
  };
  mediator.register('System.Tâche.Command.AcheverTâche', handler);
};
