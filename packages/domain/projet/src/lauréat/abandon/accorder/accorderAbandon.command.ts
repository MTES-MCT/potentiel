import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Role } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type AccorderAbandonCommand = Message<
  'Lauréat.Abandon.Command.AccorderAbandon',
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerAccorderAbandonCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<AccorderAbandonCommand> = async ({
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
    rôleUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.accorder({
      dateAccord,
      identifiantUtilisateur,
      réponseSignée,
      rôleUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.AccorderAbandon', handler);
};
