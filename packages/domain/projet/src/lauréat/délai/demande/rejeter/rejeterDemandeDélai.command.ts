import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type RejeterDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.RejeterDemandeDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    rejetéeLe: DateTime.ValueType;
    rejetéePar: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerRejeterDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RejeterDemandeDélaiCommand> = async ({
    identifiantProjet,
    rejetéeLe,
    rejetéePar,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.rejeterDemandeDélai({ rejetéeLe, rejetéePar, réponseSignée });
  };
  mediator.register('Lauréat.Délai.Command.RejeterDemandeDélai', handler);
};
