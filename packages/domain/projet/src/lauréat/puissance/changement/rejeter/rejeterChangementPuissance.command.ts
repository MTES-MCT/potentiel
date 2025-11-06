import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

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
