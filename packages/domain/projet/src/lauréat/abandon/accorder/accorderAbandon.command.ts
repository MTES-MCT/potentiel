import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

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
