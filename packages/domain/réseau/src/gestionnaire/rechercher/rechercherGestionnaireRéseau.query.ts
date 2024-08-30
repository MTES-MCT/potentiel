import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import {
  ConsulterGestionnaireRéseauReadModel,
  mapToReadModel,
} from '../consulter/consulterGestionnaireRéseau.query';

export type GestionnaireRéseauListItemReadModel = ConsulterGestionnaireRéseauReadModel;

export type RechercherGestionnaireRéseauReadModel = Readonly<{
  items: ReadonlyArray<GestionnaireRéseauListItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type RechercherGestionnaireRéseauQuery = Message<
  'Réseau.Gestionnaire.Query.RechercherGestionnaireRéseau',
  {
    range?: RangeOptions;
    raisonSociale: string;
  },
  RechercherGestionnaireRéseauReadModel
>;

export type RechercherGestionnaireRéseauQueryDependencies = {
  list: List;
};

export const registerRechercherGestionnaireRéseauQuery = ({
  list,
}: RechercherGestionnaireRéseauQueryDependencies) => {
  const handler: MessageHandler<RechercherGestionnaireRéseauQuery> = async ({
    range,
    raisonSociale,
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
        raisonSociale: Where.contains(raisonSociale),
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
  mediator.register('Réseau.Gestionnaire.Query.RechercherGestionnaireRéseau', handler);
};
