import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type DemanderConfirmationAbandonCommand = Message<
  'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    dateDemande: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerDemanderConfirmationAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<DemanderConfirmationAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateDemande,
    utilisateur,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.demanderConfirmation({
      identifiantProjet,
      réponseSignée,
      dateDemande,
      utilisateur,
    });
  };
  mediator.register('DEMANDER_CONFIRMATION_ABANDON_COMMAND', handler);
};
