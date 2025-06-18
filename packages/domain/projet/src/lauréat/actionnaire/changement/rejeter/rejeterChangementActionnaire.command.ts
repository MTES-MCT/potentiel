import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type RejeterChangementActionnaireCommand = Message<
  'Lauréat.Actionnaire.Command.RejeterDemandeChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéLe: DateTime.ValueType;
    rejetéPar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerRejeterChangementActionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RejeterChangementActionnaireCommand> = async ({
    identifiantProjet,
    rejetéLe,
    rejetéPar,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.actionnaire.rejeterDemandeChangement({
      identifiantProjet,
      rejetéLe,
      rejetéPar,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.RejeterDemandeChangement', handler);
};
