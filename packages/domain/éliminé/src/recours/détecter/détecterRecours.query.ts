import { Message, MessageHandler, mediator } from 'mediateur';

import { isSome } from '@potentiel/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { RecoursEntity } from '../recours.entity';
import { Find } from '@potentiel-domain/core';

export type DétecterRecoursQuery = Message<
  'DÉTECTER_RECOURS_QUERY',
  {
    identifiantProjetValue: string;
  },
  boolean
>;

export type DétecterRecoursDependencies = {
  find: Find;
};

export const registerDétecterRecoursQuery = ({ find }: DétecterRecoursDependencies) => {
  const handler: MessageHandler<DétecterRecoursQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<RecoursEntity>(`recours|${identifiantProjet.formatter()}`);

    return isSome(result);
  };
  mediator.register('DÉTECTER_RECOURS_QUERY', handler);
};
