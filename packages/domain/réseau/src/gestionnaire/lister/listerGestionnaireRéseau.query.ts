import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions } from '@potentiel-domain/entity';

import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import {
  ConsulterGestionnaireRéseauReadModel,
  mapToReadModel,
} from '../consulter/consulterGestionnaireRéseau.query';

export type GestionnaireRéseauListItemReadModel = ConsulterGestionnaireRéseauReadModel;

export type ListerGestionnaireRéseauReadModel = Readonly<{
  items: ReadonlyArray<GestionnaireRéseauListItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerGestionnaireRéseauQuery = Message<
  'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
  {
    range?: RangeOptions;
  },
  ListerGestionnaireRéseauReadModel
>;

export type ListerGestionnaireRéseauQueryDependencies = {
  list: List;
};

export const registerListerGestionnaireRéseauQuery = ({
  list,
}: ListerGestionnaireRéseauQueryDependencies) => {
  const handler: MessageHandler<ListerGestionnaireRéseauQuery> = async ({ range }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<GestionnaireRéseauEntity>('gestionnaire-réseau', {
      orderBy: {
        raisonSociale: 'ascending',
      },
      range,
    });

    return {
      items: items.map(mapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Réseau.Gestionnaire.Query.ListerGestionnaireRéseau', handler);
};
