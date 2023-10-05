import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { AbandonRejetéRéponseSignée } from '../abandon.valueType';
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
import { IdentifiantUtilisateurValueType } from '../../../../utilisateur/utilisateur.valueType';

export type RejeterAbandonCommand = Message<
  'REJETER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    réponseSignée: AbandonRejetéRéponseSignée;
    dateRejetAbandon: DateTimeValueType;
    rejetéPar: IdentifiantUtilisateurValueType;
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

    if (abandon.getStatut() === 'accordé') {
      throw new AbandonDéjàAccordéError();
    }

    if (abandon.getStatut() === 'rejeté') {
      throw new AbandonDéjàRejetéError();
    }

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
        rejetéPar: rejetéPar.hash(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('REJETER_ABANDON_COMMAND', handler);
};
