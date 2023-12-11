import { DomainEvent } from '@potentiel-domain/core';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauDéjàExistantError } from '../gestionnaireRéseauDéjàExistant.error';

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

export type ModifierOptions = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: string;
  };
};

export async function modifier(
  this: GestionnaireRéseauAggregate,
  {
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
  }: ModifierOptions,
) {
  if (!this.identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
    throw new GestionnaireRéseauDéjàExistantError();
  }

  const event: GestionnaireRéseauModifiéEventV1 = {
    type: 'GestionnaireRéseauModifié-V1',
    payload: {
      codeEIC: identifiantGestionnaireRéseau.formatter(),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    },
  };

  await this.publish(event);
}

export function applyGestionnaireRéseauModifié(
  this: GestionnaireRéseauAggregate,
  { payload: { codeEIC } }: GestionnaireRéseauModifiéEventV1,
) {
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC);
}
