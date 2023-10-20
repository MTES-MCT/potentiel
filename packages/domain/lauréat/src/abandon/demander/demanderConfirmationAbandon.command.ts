import { Message, MessageHandler, mediator } from 'mediateur';

import {
  DateTime,
  IdentifiantProjet,
  IdentifiantUtilisateur,
  LoadAggregateDependencies,
} from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type DemanderConfirmationAbandonCommand = Message<
  'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    dateDemande: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerDemanderConfirmationAbandonCommand = (
  dependencies: LoadAggregateDependencies,
) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory(dependencies);
  const handler: MessageHandler<DemanderConfirmationAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateDemande,
    utilisateur,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.demanderConfirmation({
      identifiantProjet,
      réponseSignée,
      dateDemande,
      utilisateur,
    });
  };
  mediator.register('DEMANDER_CONFIRMATION_ABANDON_COMMAND', handler);
};
