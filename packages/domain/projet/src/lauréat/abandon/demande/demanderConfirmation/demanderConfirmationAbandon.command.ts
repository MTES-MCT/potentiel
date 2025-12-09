import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type DemanderConfirmationAbandonCommand = Message<
  'Lauréat.Abandon.Command.DemanderConfirmationAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    dateDemande: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    rôleUtilisateur: Role.ValueType;
  }
>;

export const registerDemanderConfirmationAbandonCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderConfirmationAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateDemande,
    identifiantUtilisateur,
    rôleUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.demanderConfirmation({
      réponseSignée,
      dateDemande,
      identifiantUtilisateur,
      rôleUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.DemanderConfirmationAbandon', handler);
};
