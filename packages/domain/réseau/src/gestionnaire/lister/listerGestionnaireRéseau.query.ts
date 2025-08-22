import { type Message, type MessageHandler, mediator } from 'mediateur';

import { type List, type RangeOptions, Where } from '@potentiel-domain/entity';

import {
  type ConsulterGestionnaireRéseauReadModel,
  mapToReadModel,
} from '../consulter/consulterGestionnaireRéseau.query';
import type { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';

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
    raisonSociale?: string;
    identifiants?: string[];
  },
  ListerGestionnaireRéseauReadModel
>;

export type ListerGestionnaireRéseauQueryDependencies = {
  list: List;
};

export const registerListerGestionnaireRéseauQuery = ({
  list,
}: ListerGestionnaireRéseauQueryDependencies) => {
  const handler: MessageHandler<ListerGestionnaireRéseauQuery> = async ({
    range,
    raisonSociale,
    identifiants,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<GestionnaireRéseauEntity>('gestionnaire-réseau', {
      orderBy: {
        raisonSociale: 'ascending',
      },
      where: {
        raisonSociale: Where.contain(raisonSociale),
        codeEIC: Where.matchAny(identifiants),
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
