import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadAbandonFactory } from '../abandon.aggregate';

export type DemanderConfirmationAbandonCommand = Message<
  'Lauréat.Abandon.Command.DemanderConfirmationAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    dateDemande: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerDemanderConfirmationAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<DemanderConfirmationAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateDemande,
    identifiantUtilisateur,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.demanderConfirmation({
      identifiantProjet,
      réponseSignée,
      dateDemande,
      identifiantUtilisateur,
    });
  };
  mediator.register('Lauréat.Abandon.Command.DemanderConfirmationAbandon', handler);
};
