import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone } from '@potentiel/monads';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { createAbandonAggregateId, loadAbandonAggregateFactory } from '../abandon.aggregate';
import { AbandonAccordéRéponseSignée } from '../abandon.valueType';
import { EnregistrerRéponseSignéePort } from '../abandon.port';
import { AbandonAccordéEvent } from '../abandon.event';
import {
  AbandonDéjàAccordéError,
  AbandonDéjàRejetéError,
  DemandeAbandonInconnuErreur,
} from '../abandon.error';
import { IdentifiantProjetValueType } from '../../../common/projet.valueType';
import { DateTimeValueType } from '../../../common/dateTime.valueType';
import { IdentifiantUtilisateurValueType } from '../../../common/utilisateur.valueType';

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
        acceptéPar: accordéPar.formatter(),
      },
    };

    await publish(createAbandonAggregateId(identifiantProjet), event);
  };
  mediator.register('ACCORDER_ABANDON_COMMAND', handler);
};
