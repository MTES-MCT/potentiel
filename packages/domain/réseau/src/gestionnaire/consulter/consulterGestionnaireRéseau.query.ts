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
    format?: string;
    légende?: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail?: Email.ValueType;
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
      format: format === '' ? undefined : format,
      légende: légende === '' ? undefined : légende,
      expressionReguliere: ExpressionRegulière.convertirEnValueType(expressionReguliere),
    },
    contactEmail: contactEmail ? Email.convertirEnValueType(contactEmail) : undefined,
  };
};
