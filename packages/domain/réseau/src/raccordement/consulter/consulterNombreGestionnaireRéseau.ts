import { Count, WhereOptions } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import { RaccordementEntity } from '..';

export type ConsulterNombreDeRaccordementReadModel = {
  nombreRaccordements: number;
};

export type ConsulterNombreDeRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ConsulterNombreDeRaccordement',
  {
    where?: WhereOptions<RaccordementEntity>;
  },
  ConsulterNombreDeRaccordementReadModel
>;

export type ConsulterNombreDeRaccordementQueryDependencies = {
  count: Count;
};

export const registerConsulterNombreDeRaccordementQuery = ({
  count,
}: ConsulterNombreDeRaccordementQueryDependencies) => {
  const handler: MessageHandler<ConsulterNombreDeRaccordementQuery> = async ({ where }) => {
    const nombreRaccordements = await count<RaccordementEntity>('raccordement', {
      where,
    });

    return {
      nombreRaccordements,
    };
  };
  mediator.register('Réseau.Raccordement.Query.ConsulterNombreDeRaccordement', handler);
};
