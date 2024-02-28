import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { ExpressionRegulière } from '@potentiel-domain/common';
import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import { Message, MessageHandler, mediator } from 'mediateur';
import { List } from '@potentiel-domain/core';

type GetionnaireRéseauListItemReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
};

export type ListerGestionnaireRéseauReadModel = {
  items: ReadonlyArray<GetionnaireRéseauListItemReadModel>;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

export type ListerGestionnaireRéseauQuery = Message<
  'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
  {
    pagination: {
      page: number;
      itemsPerPage: number;
    };
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
    pagination: { itemsPerPage, page },
  }) => {
    const { currentPage, items, totalItems } = await list<GestionnaireRéseauEntity>({
      type: 'gestionnaire-réseau',
      orderBy: { property: 'raisonSociale', ascending: true },
      pagination: {
        itemsPerPage,
        page,
      },
    });

    return {
      currentPage,
      itemsPerPage,
      totalItems,
      items: items.map((item) => mapToReadModel(item)),
    };
  };
  mediator.register('Réseau.Gestionnaire.Query.ListerGestionnaireRéseau', handler);
};

const mapToReadModel = ({
  codeEIC,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
}: GestionnaireRéseauEntity): GetionnaireRéseauListItemReadModel => {
  return {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
      expressionReguliere: ExpressionRegulière.convertirEnValueType(expressionReguliere || ''),
    },
  };
};
