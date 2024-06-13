import { IdentifiantProjet } from '@potentiel-domain/common';
import { List } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

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
  {},
  ListerRaccordementReadModel
>;

export type ListerRaccordementQueryDependencies = {
  list: List;
};

export const registerListerRaccordementQuery = ({ list }: ListerRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerRaccordementQuery> = async () => {
    const { items, total } = await list<RaccordementEntity>('raccordement', {
      orderBy: {
        identifiantProjet: 'ascending',
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
