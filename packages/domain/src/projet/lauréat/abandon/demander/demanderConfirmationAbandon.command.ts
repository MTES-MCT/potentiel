import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { ConfirmationAbandonDemandéEvent } from '../abandon.event';
import { DateTimeValueType } from '../../../../common.valueType';
import {
  AbandonDéjàAccordéError,
  AbandonDéjàConfirméError,
  DemandeAbandonInconnuErreur,
  AbandonDéjàRejetéError,
  ConfirmationAbandonDéjàDemandéError,
} from '../abandon.error';
import { ConfirmationAbandonDemandéRéponseSignée } from '../abandon.valueType';
import { EnregistrerRéponseSignéePort } from '../abandon.port';

export type DemanderConfirmationAbandonCommand = Message<
  'DEMANDER_CONFIRMATION_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    dateDemandeConfirmationAbandon: DateTimeValueType;
    réponseSignée: ConfirmationAbandonDemandéRéponseSignée;
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
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new DemandeAbandonInconnuErreur();
    }

    const status = abandon.getStatus();

    if (status !== 'demandé') {
      switch (status) {
        case 'accordé':
          throw new AbandonDéjàAccordéError();
        case 'rejeté':
          throw new AbandonDéjàRejetéError();
        case 'confirmé':
          throw new AbandonDéjàConfirméError();
        case 'à-confirmer':
          throw new ConfirmationAbandonDéjàDemandéError();
      }
    }

    await enregistrerRéponseSignée({
      identifiantProjet,
      réponseSignée,
      dateDocumentRéponseSignée: dateDemandeConfirmationAbandon,
    });

    const event: ConfirmationAbandonDemandéEvent = {
      type: 'ConfirmationAbandonDemandé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        confirmationDemandéLe: dateDemandeConfirmationAbandon.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('DEMANDER_CONFIRMATION_ABANDON_COMMAND', handler);
};
