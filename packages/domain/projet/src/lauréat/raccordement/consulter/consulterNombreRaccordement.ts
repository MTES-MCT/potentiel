import { Message, MessageHandler, mediator } from 'mediateur';

import { Count, Where } from '@potentiel-domain/entity';

import { RaccordementEntity } from '../raccordement.entity.js';
export type ConsulterNombreDeRaccordementReadModel = {
  nombreRaccordements: number;
};

export type ConsulterNombreDeRaccordementQuery = Message<
  'Lauréat.Raccordement.Query.ConsulterNombreDeRaccordement',
  {
    identifiantGestionnaireRéseauValue: RaccordementEntity['identifiantGestionnaireRéseau'];
  },
  ConsulterNombreDeRaccordementReadModel
>;

export type ConsulterNombreDeRaccordementDependencies = {
  count: Count;
};

export const registerConsulterNombreDeRaccordementQuery = ({
  count,
}: ConsulterNombreDeRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterNombreDeRaccordementQuery> = async ({
    identifiantGestionnaireRéseauValue,
  }) => {
    const nombreRaccordements = await count<RaccordementEntity>('raccordement', {
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseauValue),
      },
    });

    return {
      nombreRaccordements,
    };
  };
  mediator.register('Lauréat.Raccordement.Query.ConsulterNombreDeRaccordement', handler);
};
