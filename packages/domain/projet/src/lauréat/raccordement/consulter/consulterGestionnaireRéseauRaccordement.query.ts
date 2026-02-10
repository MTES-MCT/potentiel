import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { RaccordementEntity } from '../raccordement.entity.js';
import { IdentifiantProjet } from '../../../index.js';

export type ConsulterGestionnaireRéseauRaccordementReadModel = {
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: Option.Type<string>;
    légende: Option.Type<string>;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail: Option.Type<Email.ValueType>;
};

export type ConsulterGestionnaireRéseauRaccordementQuery = Message<
  'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterGestionnaireRéseauRaccordementReadModel>
>;

export type ConsulterGestionnaireRéseauRaccordementDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauRaccordementQuery = ({
  find,
}: ConsulterGestionnaireRéseauRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterGestionnaireRéseauRaccordementQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const raccordementResult = await find<RaccordementEntity>(
      `raccordement|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(raccordementResult)) {
      return Option.none;
    }

    const gestionnaireRéseauResult = await find<GestionnaireRéseau.GestionnaireRéseauEntity>(
      `gestionnaire-réseau|${raccordementResult.identifiantGestionnaireRéseau}`,
    );

    return Option.match(gestionnaireRéseauResult)
      .some((grd) => mapToReadModel(grd))
      .none();
  };

  mediator.register('Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement', handler);
};

export const mapToReadModel = ({
  codeEIC,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  contactEmail,
}: GestionnaireRéseau.GestionnaireRéseauEntity): ConsulterGestionnaireRéseauRaccordementReadModel => {
  return {
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
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
