import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type DemanderConfirmationAbandonCommand = Message<
  'Lauréat.Abandon.Command.DemanderConfirmationAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    dateDemande: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
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
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.demanderConfirmation({
      réponseSignée,
      dateDemande,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.DemanderConfirmationAbandon', handler);
};
