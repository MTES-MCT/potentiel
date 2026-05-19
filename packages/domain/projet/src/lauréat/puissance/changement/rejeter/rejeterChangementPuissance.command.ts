import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type RejeterChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.RejeterDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    estUneDécisionDEtat: boolean;
  }
>;

export const registerRejeterChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RejeterChangementPuissanceCommand> = async ({
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
    estUneDécisionDEtat,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.rejeterDemandeChangement({
      rejetéLe,
      rejetéPar,
      réponseSignée,
      estUneDécisionDEtat,
    });
  };
  mediator.register('Lauréat.Puissance.Command.RejeterDemandeChangement', handler);
};
