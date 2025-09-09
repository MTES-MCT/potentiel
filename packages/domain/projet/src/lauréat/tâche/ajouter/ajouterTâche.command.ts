import { Message, MessageHandler, mediator } from 'mediateur';

import * as Tâche from '../typeTâche.valueType';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type AjouterTâcheCommand = Message<
  'System.Tâche.Command.AjouterTâche',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâche: Tâche.ValueType;
  }
>;

export type AjouterTâcheCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAjouterTâcheCommand = ({
  getProjetAggregateRoot,
}: AjouterTâcheCommandDependencies) => {
  const handler: MessageHandler<AjouterTâcheCommand> = async ({ identifiantProjet, typeTâche }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    const tâche = await projet.lauréat.loadTâche(typeTâche.type);

    await tâche.ajouter();
  };
  mediator.register('System.Tâche.Command.AjouterTâche', handler);
};
