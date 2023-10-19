import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type AnnulerAbandonCommand = Message<
  'ANNULER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    annuléPar: IdentifiantUtilisateur.ValueType;
  }
>;

export type AnnulerAbandonDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerAnnulerAbandonCommand = ({
  loadAggregate,
  publish,
}: AnnulerAbandonDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory({ loadAggregate, publish });
  const handler: MessageHandler<AnnulerAbandonCommand> = async ({
    identifiantProjet,
    annuléPar,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.annuler({
      identifiantProjet,
      annuléPar,
    });
  };
  mediator.register('ANNULER_ABANDON_COMMAND', handler);
};
