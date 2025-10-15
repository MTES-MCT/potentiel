import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AccorderChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.AccorderDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée?: DocumentProjet.ValueType;
    estUneDécisionDEtat: boolean;
  }
>;

export const registerAccorderChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AccorderChangementPuissanceCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
    estUneDécisionDEtat,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.accorderDemandeChangement({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
      estUneDécisionDEtat,
    });
  };
  mediator.register('Lauréat.Puissance.Command.AccorderDemandeChangement', handler);
};
