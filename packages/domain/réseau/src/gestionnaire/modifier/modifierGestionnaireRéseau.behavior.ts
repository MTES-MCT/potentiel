import { ExpressionRegulière } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { match } from 'ts-pattern';

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
  contactEmail: Option.Type<IdentifiantUtilisateur.ValueType>;
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
      contactEmail: Option.match(contactEmail)
        .some((email) => email.formatter())
        .none(() => ''),
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
  this.référenceDossierRaccordementExpressionRegulière = match(expressionReguliere)
    .with('', () => ExpressionRegulière.accepteTout)
    .otherwise((value) => ExpressionRegulière.convertirEnValueType(value));
}
