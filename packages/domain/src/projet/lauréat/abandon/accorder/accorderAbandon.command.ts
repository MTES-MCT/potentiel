import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjetValueType } from '../../../projet.valueType';
import { AbandonAccordéRéponseSignée } from '../abandon.valueType';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { EnregistrerRéponseSignéePort } from '../abandon.port';
import { DateTimeValueType } from '../../../../common.valueType';
import { AbandonAccordéEvent } from '../abandon.event';
import {
  AbandonDéjàAccordéError,
  AbandonDéjàConfirméError,
  DemandeAbandonInconnuErreur,
} from '../abandon.error';
import { IdentifiantUtilisateurValueType } from '../../../../domain.valueType';

export type AccorderAbandonCommand = Message<
  'ACCORDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    réponseSignée: AbandonAccordéRéponseSignée;
    dateAccordAbandon: DateTimeValueType;
    accordéPar: IdentifiantUtilisateurValueType;
  }
>;

export type AccorderAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerRéponseSignée: EnregistrerRéponseSignéePort;
};

export const registerAccorderAbandonCommand = ({
  loadAggregate,
  publish,
  enregistrerRéponseSignée,
}: AccorderAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate });
  const handler: MessageHandler<AccorderAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateAccordAbandon,
    accordéPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    if (isNone(abandon)) {
      throw new DemandeAbandonInconnuErreur();
    }

    if (abandon.getStatut() === 'accordé') {
      throw new AbandonDéjàAccordéError();
    }

    if (abandon.getStatut() === 'rejeté') {
      throw new AbandonDéjàConfirméError();
    }

    await enregistrerRéponseSignée({
      identifiantProjet,
      réponseSignée,
      dateDocumentRéponseSignée: dateAccordAbandon,
    });

    const event: AbandonAccordéEvent = {
      type: 'AbandonAccordé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
        acceptéLe: dateAccordAbandon.formatter(),
        acceptéPar: accordéPar.hash(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('ACCORDER_ABANDON_COMMAND', handler);
};
