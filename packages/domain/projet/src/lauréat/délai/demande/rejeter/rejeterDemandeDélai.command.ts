import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type RejeterDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.RejeterDemandeDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateRejet: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerRejeterDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<RejeterDemandeDélaiCommand> = async ({
    identifiantProjet,
    dateRejet,
    identifiantUtilisateur,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.rejeterDemandeDélai({
      dateRejet,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Délai.Command.RejeterDemandeDélai', handler);
};
