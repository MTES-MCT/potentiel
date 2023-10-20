import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import {
  IdentifiantProjet,
  IdentifiantUtilisateur,
  DocumentProjet,
} from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type AccorderAbandonCommand = Message<
  'ACCORDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    accordéPar: IdentifiantUtilisateur.ValueType;
  }
>;

export type AccorderAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerAccorderAbandonCommand = ({
  loadAggregate,
  publish,
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
  };
  mediator.register('ACCORDER_ABANDON_COMMAND', handler);
};
