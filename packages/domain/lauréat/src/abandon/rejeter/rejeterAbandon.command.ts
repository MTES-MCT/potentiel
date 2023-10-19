import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';
import { EnregistrerRéponseSignéePort } from '../abandon.port';
import { AbandonRejetéRéponseSignéeValueType } from '../réponseSignée.valueType';

export type RejeterAbandonCommand = Message<
  'REJETER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: AbandonRejetéRéponseSignéeValueType;
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
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate, publish });
  const handler: MessageHandler<RejeterAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    rejetéPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.rejeter({
      identifiantProjet,
      rejetéPar,
      réponseSignée,
    });

    await enregistrerRéponseSignée({
      identifiantProjet,
      réponseSignée,
      dateDocumentRéponseSignée: abandon.rejet?.rejetéLe!,
    });
  };
  mediator.register('REJETER_ABANDON_COMMAND', handler);
};
