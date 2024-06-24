import { Message, MessageHandler, mediator } from 'mediateur';

import { Count } from '@potentiel-domain/core';

import { RaccordementEntity } from '..';

export type ConsulterNombreDeRaccordementReadModel = {
  nombreRaccordements: number;
};

export type ConsulterNombreDeRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ConsulterNombreDeRaccordement',
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
        identifiantGestionnaireRéseau: {
          operator: 'equal',
          value: identifiantGestionnaireRéseauValue,
        },
      },
    });

    return {
      nombreRaccordements,
    };
  };
  mediator.register('Réseau.Raccordement.Query.ConsulterNombreDeRaccordement', handler);
};
