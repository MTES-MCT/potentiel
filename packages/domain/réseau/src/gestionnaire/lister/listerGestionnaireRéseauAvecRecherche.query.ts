import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, WhereOptions } from '@potentiel-domain/entity';

import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import {
  ConsulterGestionnaireRéseauReadModel,
  mapToReadModel,
} from '../consulter/consulterGestionnaireRéseau.query';

export type GestionnaireRéseauListItemReadModel = ConsulterGestionnaireRéseauReadModel;

export type ListerGestionnaireRéseauAvecRechercheReadModel = Readonly<{
  items: ReadonlyArray<GestionnaireRéseauListItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerGestionnaireRéseauAvecRechercheQuery = Message<
  'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
  {
    range?: RangeOptions;
    /**
     * @deprecated les conditions where ne devraient pas être au niveau de la liste. Le besoin ici est de faire une recherche sur une raison sociale de GRD, il faut une autre query pour ça
     */
    where?: WhereOptions<Pick<GestionnaireRéseauEntity, 'raisonSociale'>>;
  },
  ListerGestionnaireRéseauAvecRechercheReadModel
>;

export type ListerGestionnaireRéseauAvecRechercheQueryDependencies = {
  list: List;
};

export const registerListerGestionnaireRéseauAvecRechercheQuery = ({
  list,
}: ListerGestionnaireRéseauAvecRechercheQueryDependencies) => {
  const handler: MessageHandler<ListerGestionnaireRéseauAvecRechercheQuery> = async ({
    range,
    where,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<GestionnaireRéseauEntity>('gestionnaire-réseau', {
      orderBy: {
        raisonSociale: 'ascending',
      },
      where,
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
