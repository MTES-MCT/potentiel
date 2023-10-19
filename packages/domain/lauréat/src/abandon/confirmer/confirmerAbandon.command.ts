import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type ConfirmerAbandonCommand = Message<
  'CONFIRMER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    confirméPar: IdentifiantUtilisateur.ValueType;
  }
>;

export type ConfirmerAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerConfirmerAbandonCommand = ({
  loadAggregate,
  publish,
}: ConfirmerAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate, publish });
  const handler: MessageHandler<ConfirmerAbandonCommand> = async ({
    identifiantProjet,
    confirméPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.confirmer({
      confirméPar,
      identifiantProjet,
    });
  };
  mediator.register('CONFIRMER_ABANDON_COMMAND', handler);
};
