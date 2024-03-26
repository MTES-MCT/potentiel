import { DomainEvent } from '@potentiel-domain/core';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauDéjàExistantError } from '../gestionnaireRéseauDéjàExistant.error';
import { ExpressionRegulière } from '@potentiel-domain/common';

export type GestionnaireRéseauAjoutéEvent = DomainEvent<
  'GestionnaireRéseauAjouté-V1',
  {
    raisonSociale: string;
    codeEIC: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;

export type AjouterOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
};

export async function ajouter(
  this: GestionnaireRéseauAggregate,
  {
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    identifiantGestionnaireRéseau,
    raisonSociale,
  }: AjouterOptions,
) {
  if (!this.identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
    throw new GestionnaireRéseauDéjàExistantError();
  }

  const event: GestionnaireRéseauAjoutéEvent = {
    type: 'GestionnaireRéseauAjouté-V1',
    payload: {
      codeEIC: identifiantGestionnaireRéseau.formatter(),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format,
        légende,
        expressionReguliere: expressionReguliere.formatter(),
      },
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
  }: GestionnaireRéseauAjoutéEvent,
) {
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC);
  this.référenceDossierRaccordementExpressionRegulière = !expressionReguliere
    ? ExpressionRegulière.défaut
    : ExpressionRegulière.convertirEnValueType(expressionReguliere);
}
