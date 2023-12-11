import { DomainEvent } from '@potentiel-domain/core';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

export type GestionnaireRéseauAjoutéEventV1 = DomainEvent<
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
    expressionReguliere: string;
  };
};

export async function ajouter(
  this: GestionnaireRéseauAggregate,
  {
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
  }: AjouterOptions,
) {
  const event: GestionnaireRéseauAjoutéEventV1 = {
    type: 'GestionnaireRéseauAjouté-V1',
    payload: {
      codeEIC: identifiantGestionnaireRéseau.formatter(),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    },
  };

  await this.publish(event);
}

export function applyGestionnaireRéseauAjouté(
  this: GestionnaireRéseauAggregate,
  { payload: { codeEIC } }: GestionnaireRéseauAjoutéEventV1,
) {
  this.identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC);
}
