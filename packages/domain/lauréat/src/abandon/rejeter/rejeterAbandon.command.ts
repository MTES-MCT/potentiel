import { Message, MessageHandler, mediator } from 'mediateur';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { isNone } from '@potentiel/monads';
import { EnregistrerRéponseSignéePort } from '../abandon.port';
import { AbandonRejetéEvent } from '../abandon.event';
import {
  AbandonDéjàAccordéError,
  AbandonDéjàRejetéError,
  DemandeAbandonInconnuErreur,
} from '../abandon.error';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { AbandonRejetéRéponseSignéeValueType } from '../réponseSignée.valueType';

export type RejeterAbandonCommand = Message<
  'REJETER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: AbandonRejetéRéponseSignéeValueType;
    dateRejetAbandon: DateTime.ValueType;
    rejetéPar: IdentifiantUtilisateur.ValueType;
  }
>;

export type RejeterAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerRéponseSignée: EnregistrerRéponseSignéePort;
};

export const registerRejeterAbandonCommand = ({
  loadAggregate,
  publish,
  enregistrerRéponseSignée,
}: RejeterAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<RejeterAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejetAbandon,
    rejetéPar,
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

    // if (abandon.estEnAttenteConfirmation()) {
    //   throw new DemandeEnAttenteConfirmationError();
    // }

    await enregistrerRéponseSignée({
      identifiantProjet,
      réponseSignée,
      dateDocumentRéponseSignée: dateRejetAbandon,
    });

    const event: AbandonRejetéEvent = {
      type: 'AbandonRejeté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        rejetéLe: dateRejetAbandon.formatter(),
        rejetéPar: rejetéPar.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('REJETER_ABANDON_COMMAND', handler);
};
