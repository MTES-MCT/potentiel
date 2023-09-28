import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { RéponseSignée } from '../abandon.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { EnregistrerRéponseSignéePort } from '../abandon.port';
import { DateTimeValueType } from '../../../../common.valueType';
import { AbandonRejetéEvent } from '../abandon.event';
import {
  AbandonDéjàAccordéError,
  AbandonDéjàRejetéError,
  DemandeAbandonInconnuErreur,
} from '../abandon.error';

export type RejeterAbandonCommand = Message<
  'REJETER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    réponseSignée: RéponseSignée;
    rejetéLe: DateTimeValueType;
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
    rejetéLe,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new DemandeAbandonInconnuErreur();
    }

    if (abandon.getStatus() === 'accordé') {
      throw new AbandonDéjàAccordéError();
    }

    if (abandon.getStatus() === 'rejeté') {
      throw new AbandonDéjàRejetéError();
    }

    await enregistrerRéponseSignée({
      identifiantProjet: identifiantProjet.formatter(),
      réponseSignée,
    });

    const event: AbandonRejetéEvent = {
      type: 'AbandonRejeté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        rejetéLe: rejetéLe.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('REJETER_ABANDON_COMMAND', handler);
};
