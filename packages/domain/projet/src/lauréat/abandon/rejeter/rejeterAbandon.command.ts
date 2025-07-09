import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type RejeterAbandonCommand = Message<
  'Lauréat.Abandon.Command.RejeterAbandon',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerRejeterAbandonCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<RejeterAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejet,
    identifiantUtilisateur,
    rôleUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.rejeter({
      dateRejet,
      identifiantUtilisateur,
      rôleUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Lauréat.Abandon.Command.RejeterAbandon', handler);
};
