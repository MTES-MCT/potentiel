import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AccorderChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.AccorderDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    accordéLe: DateTime.ValueType;
    accordéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderChangementActionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AccorderChangementActionnaireCommand> = async ({
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.actionnaire.accorderDemandeChangement({
      identifiantProjet,
      accordéLe,
      accordéPar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.AccorderDemandeChangement', handler);
};
