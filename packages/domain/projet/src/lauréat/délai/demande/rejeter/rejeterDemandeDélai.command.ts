import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

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
