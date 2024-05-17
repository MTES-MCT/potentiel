import { match } from 'ts-pattern';
import { ExpressionRegulière } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type ConsulterGestionnaireRéseauReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail: Option.Type<IdentifiantUtilisateur.ValueType>;
};

export type ConsulterGestionnaireRéseauQuery = Message<
  'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: string;
  },
  Option.Type<ConsulterGestionnaireRéseauReadModel>
>;

export type ConsulterGestionnaireRéseauQueryDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauQuery = ({
  find,
}: ConsulterGestionnaireRéseauQueryDependencies) => {
  const handler: MessageHandler<ConsulterGestionnaireRéseauQuery> = async ({
    identifiantGestionnaireRéseau,
  }) => {
    const result = await find<GestionnaireRéseauEntity>(
      `gestionnaire-réseau|${identifiantGestionnaireRéseau}`,
    );

    return Option.isNone(result) ? Option.none : mapToReadModel(result);
  };

  mediator.register('Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau', handler);
};

const mapToReadModel = ({
  codeEIC,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  contactEmail,
}: GestionnaireRéseauEntity): ConsulterGestionnaireRéseauReadModel => {
  return {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
      expressionReguliere: match(expressionReguliere)
        .returnType<ExpressionRegulière.ValueType>()
        .with('', () => ExpressionRegulière.accepteTout)
        .otherwise(() => ExpressionRegulière.convertirEnValueType(expressionReguliere)),
    },
    contactEmail: match(contactEmail)
      .returnType<Option.Type<IdentifiantUtilisateur.ValueType>>()
      .with('', () => Option.none)
      .otherwise(() => IdentifiantUtilisateur.convertirEnValueType(contactEmail)),
  };
};
