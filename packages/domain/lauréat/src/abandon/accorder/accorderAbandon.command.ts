import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';
import { EnregistrerRéponseSignéePort } from '../abandon.port';

import { AbandonAccordéRéponseSignéeValueType } from '../réponseSignée.valueType';

export type AccorderAbandonCommand = Message<
  'ACCORDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: AbandonAccordéRéponseSignéeValueType;
    accordéPar: IdentifiantUtilisateur.ValueType;
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
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate, publish });
  const handler: MessageHandler<AccorderAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    accordéPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.accorder({
      identifiantProjet,
      réponseSignée,
      accordéPar,
    });

    await enregistrerRéponseSignée({
      identifiantProjet,
      réponseSignée,
      dateDocumentRéponseSignée: abandon.accord?.accordéLe!,
    });
  };
  mediator.register('ACCORDER_ABANDON_COMMAND', handler);
};
