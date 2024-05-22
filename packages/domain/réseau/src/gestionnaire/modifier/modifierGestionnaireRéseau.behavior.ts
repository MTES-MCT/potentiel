import { ExpressionRegulière } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import * as ContactEmailGestionnaireRéseau from '../contactEmailGestionnaireRéseau.valueType';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

/**
 * @deprecated Use GestionnaireRéseauModifiéEvent instead
 */
export type GestionnaireRéseauModifiéEventV1 = DomainEvent<
  'GestionnaireRéseauModifié-V1',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;

export type GestionnaireRéseauModifiéEvent = DomainEvent<
  'GestionnaireRéseauModifié-V2',
  {
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
    contactEmail: string;
  }
>;

export type ModifierOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail: Option.Type<ContactEmailGestionnaireRéseau.ValueType>;
};

export async function modifier(
  this: GestionnaireRéseauAggregate,
  {
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    identifiantGestionnaireRéseau,
    raisonSociale,
    contactEmail,
  }: ModifierOptions,
) {
  const event: GestionnaireRéseauModifiéEvent = {
    type: 'GestionnaireRéseauModifié-V2',
    payload: {
      codeEIC: identifiantGestionnaireRéseau.formatter(),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format,
        légende,
        expressionReguliere: expressionReguliere.formatter(),
      },
      contactEmail: Option.isSome(contactEmail)
        ? contactEmail.formatter()
        : ContactEmailGestionnaireRéseau.defaultValue.email,
    },
  };

  await this.publish(event);
}

export function applyGestionnaireRéseauModifié(
  this: GestionnaireRéseauAggregate,
  {
    payload: {
      codeEIC,
      aideSaisieRéférenceDossierRaccordement: { expressionReguliere },
    },
  }: GestionnaireRéseauModifiéEventV1 | GestionnaireRéseauModifiéEvent,
) {
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC);
  this.référenceDossierRaccordementExpressionRegulière = !expressionReguliere
    ? ExpressionRegulière.accepteTout
    : ExpressionRegulière.convertirEnValueType(expressionReguliere);
}
