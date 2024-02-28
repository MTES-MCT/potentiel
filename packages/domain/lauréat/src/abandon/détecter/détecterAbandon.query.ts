import { Message, MessageHandler, mediator } from 'mediateur';

import { isSome } from '@potentiel/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { AbandonEntity } from '../abandon.entity';
import { Find } from '@potentiel-domain/core';

export type DétecterAbandonQuery = Message<
  'Lauréat.Abandon.Query.DétecterAbandon',
  {
    identifiantProjetValue: string;
  },
  boolean
>;

export type DétecterAbandonDependencies = {
  find: Find;
};

export const registerDétecterAbandonQuery = ({ find }: DétecterAbandonDependencies) => {
  const handler: MessageHandler<DétecterAbandonQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<AbandonEntity>(`abandon|${identifiantProjet.formatter()}`);

    return isSome(result);
  };
  mediator.register('Lauréat.Abandon.Query.DétecterAbandon', handler);
};
