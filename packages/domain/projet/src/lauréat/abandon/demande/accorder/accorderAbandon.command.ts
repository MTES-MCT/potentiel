import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type AccorderAbandonCommand = Message<
  'Lauréat.Abandon.Command.AccorderAbandon',
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    rôleUtilisateur: Role.ValueType;
    PPASignalé?: true;
    PPAAnnulé?: true;
  }
>;

export const registerAccorderAbandonCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<AccorderAbandonCommand> = async ({
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
    rôleUtilisateur,
    PPASignalé,
    PPAAnnulé,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.accorder({
      dateAccord,
      identifiantUtilisateur,
      réponseSignée,
      rôleUtilisateur,
      PPASignalé,
      PPAAnnulé,
    });
  };
  mediator.register('Lauréat.Abandon.Command.AccorderAbandon', handler);
};
