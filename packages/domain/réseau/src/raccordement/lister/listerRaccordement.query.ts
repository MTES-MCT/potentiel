import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { List, Where } from '@potentiel-domain/entity';

import { RaccordementEntity } from '..';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type RaccordementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
};

export type ListerRaccordementReadModel = {
  items: ReadonlyArray<RaccordementReadModel>;
  total: number;
};

export type ListerRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ListerRaccordement',
  {
    identifiantGestionnaireRéseauValue?: string;
  },
  ListerRaccordementReadModel
>;

export type ListerRaccordementQueryDependencies = {
  list: List;
};

export const registerListerRaccordementQuery = ({ list }: ListerRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerRaccordementQuery> = async ({
    identifiantGestionnaireRéseauValue,
  }) => {
    const { items, total } = await list<RaccordementEntity>('raccordement', {
      orderBy: {
        identifiantProjet: 'ascending',
      },
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseauValue),
      },
    });

    return {
      items: items.map((item) => mapToReadModel(item)),
      total,
    };
  };
  mediator.register('Réseau.Raccordement.Query.ListerRaccordement', handler);
};

const mapToReadModel = (raccordement: RaccordementEntity): RaccordementReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(raccordement.identifiantProjet),
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
      raccordement.identifiantGestionnaireRéseau,
    ),
  };
};
