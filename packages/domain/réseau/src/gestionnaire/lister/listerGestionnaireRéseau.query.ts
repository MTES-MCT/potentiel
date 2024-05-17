import { ExpressionRegulière } from '@potentiel-domain/common';
import { ListV2, RangeOptions, WhereOptions } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';
import * as ContactEmailGestionnaireRéseau from '../contactEmailGestionnaireRéseau.valueType';
import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

import { Option } from '@potentiel-libraries/monads';

type GestionnaireRéseauListItemReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail: Option.Type<ContactEmailGestionnaireRéseau.ValueType>;
};

export type ListerGestionnaireRéseauReadModel = {
  items: ReadonlyArray<GestionnaireRéseauListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerGestionnaireRéseauQuery = Message<
  'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
  {
    range?: RangeOptions;
    where?: WhereOptions<Pick<GestionnaireRéseauEntity, 'raisonSociale'>>;
  },
  ListerGestionnaireRéseauReadModel
>;

export type ListerGestionnaireRéseauQueryDependencies = {
  listV2: ListV2;
};

export const registerListerGestionnaireRéseauQuery = ({
  listV2: list,
}: ListerGestionnaireRéseauQueryDependencies) => {
  const handler: MessageHandler<ListerGestionnaireRéseauQuery> = async ({ range, where }) => {
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
  contactEmail,
}: GestionnaireRéseauEntity): GestionnaireRéseauListItemReadModel => {
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
    contactEmail: Option.isNone(contactEmail)
      ? ContactEmailGestionnaireRéseau.defaultValue
      : ContactEmailGestionnaireRéseau.convertirEnValueType(contactEmail),
  };
};
