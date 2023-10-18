import { Message, MessageHandler, mediator } from 'mediateur';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { isNone } from '@potentiel/monads';
import { ConfirmationAbandonDemandéeEvent } from '../abandon.event';
import {
  AbandonDéjàAccordéError,
  AbandonDéjàConfirméError,
  DemandeAbandonInconnuErreur,
  AbandonDéjàRejetéError,
  ConfirmationAbandonDéjàDemandéError,
} from '../abandon.error';
import { EnregistrerRéponseSignéePort } from '../abandon.port';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { ConfirmationAbandonDemandéRéponseSignéeValueType } from '../réponseSignée.valueType';

export type DemanderConfirmationAbandonCommand = Message<
  'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateDemandeConfirmationAbandon: DateTime.ValueType;
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
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<DemanderConfirmationAbandonCommand> = async ({
    identifiantProjet,
    dateDemandeConfirmationAbandon,
    réponseSignée,
    confirmationDemandéePar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new DemandeAbandonInconnuErreur();
    }

    if (abandon.estAccordé()) {
      throw new AbandonDéjàAccordéError();
    }

    if (abandon.estRejeté()) {
      throw new AbandonDéjàRejetéError();
    }

    if (abandon.estEnAttenteConfirmation()) {
      throw new ConfirmationAbandonDéjàDemandéError();
    }

    if (abandon.estConfirmé()) {
      throw new AbandonDéjàConfirméError();
    }

    await enregistrerRéponseSignée({
      identifiantProjet,
      réponseSignée,
      dateDocumentRéponseSignée: dateDemandeConfirmationAbandon,
    });

    const event: ConfirmationAbandonDemandéeEvent = {
      type: 'ConfirmationAbandonDemandée-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        confirmationDemandéeLe: dateDemandeConfirmationAbandon.formatter(),
        confirmationDemandéePar: confirmationDemandéePar.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('DEMANDER_CONFIRMATION_ABANDON_COMMAND', handler);
};
