import { IdentifiantProjet } from '@potentiel-domain/common';
import { ListV2, WhereOptions } from '@potentiel-domain/core';
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
  /**
   * @todo Avoir une discussion autour de l'utilisation de `WhereOptions` pour les queries
   */
  { where?: WhereOptions<RaccordementEntity> },
  ListerRaccordementReadModel
>;

export type ListerRaccordementQueryDependencies = {
  listV2: ListV2;
};

export const registerListerRaccordementQuery = ({
  listV2,
}: ListerRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerRaccordementQuery> = async ({ where }) => {
    const { items, total } = await listV2<RaccordementEntity>('raccordement', {
      orderBy: {
        identifiantProjet: 'ascending',
      },
      where,
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
