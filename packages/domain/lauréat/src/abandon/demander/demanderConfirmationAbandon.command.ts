import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';
import { EnregistrerRéponseSignéePort } from '../abandon.port';
import { ConfirmationAbandonDemandéRéponseSignéeValueType } from '../réponseSignée.valueType';

export type DemanderConfirmationAbandonCommand = Message<
  'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: ConfirmationAbandonDemandéRéponseSignéeValueType;
    confirmationDemandéePar: IdentifiantUtilisateur.ValueType;
  }
>;

export type DemanderConfirmationAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerRéponseSignée: EnregistrerRéponseSignéePort;
};

export const registerDemanderConfirmationAbandonCommand = ({
  loadAggregate,
  publish,
  enregistrerRéponseSignée,
}: DemanderConfirmationAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate, publish });
  const handler: MessageHandler<DemanderConfirmationAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    confirmationDemandéePar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.demanderConfirmation({
      identifiantProjet,
      réponseSignée,
      confirmationDemandéePar,
    });

    await enregistrerRéponseSignée({
      identifiantProjet,
      réponseSignée,
      dateDocumentRéponseSignée: abandon.demande.confirmation?.confirméLe!,
    });
  };
  mediator.register('DEMANDER_CONFIRMATION_ABANDON_COMMAND', handler);
};
