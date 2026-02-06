import { match } from 'ts-pattern';
import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity.js';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType.js';

export type ConsulterGestionnaireRéseauReadModel = Readonly<{
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: Option.Type<string>;
    légende: Option.Type<string>;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail: Option.Type<Email.ValueType>;
}>;

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
    if (
      identifiantGestionnaireRéseau &&
      IdentifiantGestionnaireRéseau.convertirEnValueType(identifiantGestionnaireRéseau).estInconnu()
    ) {
      return {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
        aideSaisieRéférenceDossierRaccordement: {
          expressionReguliere: ExpressionRegulière.accepteTout,
          format: '',
          légende: '',
        },
        raisonSociale: 'Inconnu',
        contactEmail: Option.none,
      };
    }
    const result = await find<GestionnaireRéseauEntity>(
      `gestionnaire-réseau|${identifiantGestionnaireRéseau}`,
    );

    return Option.match(result).some(mapToReadModel).none();
  };

  mediator.register('Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau', handler);
};

export const mapToReadModel = ({
  codeEIC,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  contactEmail,
}: GestionnaireRéseauEntity): ConsulterGestionnaireRéseauReadModel => {
  return {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format: match(format)
        .returnType<Option.Type<string>>()
        .with('', () => Option.none)
        .otherwise((format) => format),
      légende: match(légende)
        .returnType<Option.Type<string>>()
        .with('', () => Option.none)
        .otherwise((légende) => légende),
      expressionReguliere: ExpressionRegulière.convertirEnValueType(expressionReguliere),
    },
    contactEmail: match(contactEmail)
      .returnType<Option.Type<Email.ValueType>>()
      .with('', () => Option.none)
      .otherwise((email) => Email.convertirEnValueType(email)),
  };
};
