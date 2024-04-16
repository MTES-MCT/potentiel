import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { ExpressionRegulière } from '@potentiel-domain/common';
import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import { Message, MessageHandler, mediator } from 'mediateur';
import { ListV2, RangeOptions } from '@potentiel-domain/core';

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
  range: RangeOptions;
  total: number;
};

export type ListerGestionnaireRéseauQuery = Message<
  'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
  {
    range?: RangeOptions;
  },
  ListerGestionnaireRéseauReadModel
>;

export type ListerGestionnaireRéseauQueryDependencies = {
  listV2: ListV2;
};

export const registerListerGestionnaireRéseauQuery = ({
  listV2: list,
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
      items: items.map((item) => mapToReadModel(item)),
      range: {
        endPosition,
        startPosition,
      },
      total,
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
      expressionReguliere: !expressionReguliere
        ? ExpressionRegulière.accepteTout
        : ExpressionRegulière.convertirEnValueType(expressionReguliere),
    },
  };
};
