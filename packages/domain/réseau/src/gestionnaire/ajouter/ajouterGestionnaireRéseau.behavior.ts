import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauDéjàExistantError } from '../gestionnaireRéseauDéjàExistant.error';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { match } from 'ts-pattern';

/**
 * @deprecated use GestionnaireRéseauAjoutéEvent instead
 */
export type GestionnaireRéseauAjoutéEventV1 = DomainEvent<
  'GestionnaireRéseauAjouté-V1',
  {
    raisonSociale: string;
    codeEIC: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere?: string;
    };
  }
>;

export type GestionnaireRéseauAjoutéEvent = DomainEvent<
  'GestionnaireRéseauAjouté-V2',
  {
    raisonSociale: string;
    codeEIC: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
    contactEmail: string;
  }
>;

export type AjouterOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: Option.Type<string>;
    légende: Option.Type<string>;
    expressionReguliere: Option.Type<ExpressionRegulière.ValueType>;
  };
  contactEmail: Option.Type<Email.ValueType>;
};

export async function ajouter(
  this: GestionnaireRéseauAggregate,
  {
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    identifiantGestionnaireRéseau,
    raisonSociale,
    contactEmail,
  }: AjouterOptions,
) {
  if (!this.identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
    throw new GestionnaireRéseauDéjàExistantError();
  }

  const event: GestionnaireRéseauAjoutéEvent = {
    type: 'GestionnaireRéseauAjouté-V2',
    payload: {
      codeEIC: identifiantGestionnaireRéseau.formatter(),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: Option.match(format)
          .some((value) => value)
          .none(() => ''),
        légende: Option.match(légende)
          .some((value) => value)
          .none(() => ''),
        expressionReguliere: Option.match(expressionReguliere)
          .some((value) => value.formatter())
          .none(() => ExpressionRegulière.accepteTout.formatter()),
      },
      contactEmail: Option.match(contactEmail)
        .some((value) => value.formatter())
        .none(() => ''),
    },
  };

  await this.publish(event);
}

export function applyGestionnaireRéseauAjouté(
  this: GestionnaireRéseauAggregate,
  {
    payload: {
      codeEIC,
      aideSaisieRéférenceDossierRaccordement: { expressionReguliere },
    },
  }: GestionnaireRéseauAjoutéEventV1 | GestionnaireRéseauAjoutéEvent,
) {
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC);
  this.référenceDossierRaccordementExpressionRegulière = match(expressionReguliere)
    .with('', () => ExpressionRegulière.accepteTout)
    .with(undefined, () => ExpressionRegulière.accepteTout)
    .otherwise((value) => ExpressionRegulière.convertirEnValueType(value));
}
