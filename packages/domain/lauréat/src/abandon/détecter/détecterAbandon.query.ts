import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';

import { AbandonEntity } from '../abandon.entity';

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

    return Option.isSome(result);
  };
  mediator.register('Lauréat.Abandon.Query.DétecterAbandon', handler);
};
