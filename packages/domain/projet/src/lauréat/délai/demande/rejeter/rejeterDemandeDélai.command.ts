import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type RejeterDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.RejeterDemandeDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateRejet: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    rôleUtilisateur: Role.ValueType;
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
    rôleUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.rejeterDemandeDélai({
      dateRejet,
      identifiantUtilisateur,
      réponseSignée,
      rôleUtilisateur,
    });
  };
  mediator.register('Lauréat.Délai.Command.RejeterDemandeDélai', handler);
};
