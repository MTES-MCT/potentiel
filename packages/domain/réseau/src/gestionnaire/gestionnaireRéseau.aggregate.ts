import { match, Pattern } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { ExpressionRegulière } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { GestionnaireRéseauAjoutéEvent } from './ajouter/ajouter.event';
import * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauModifiéEvent } from './modifier/modifierGestionnaireRéseau.event';
import { GestionnaireRéseauDéjàExistantError } from './gestionnaireRéseauDéjàExistant.error';
import { AjouterOptions } from './ajouter/ajouter.options';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau.event';
import { ModifierOptions } from './modifier/modifierGestionnaireRéseau.options';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';

export class GestionnaireRéseauAggregate extends AbstractAggregate<
  GestionnaireRéseauEvent,
  'gestionnaire-réseau'
> {
  #identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.inconnu;
  #référenceDossierRaccordementExpressionRegulière = ExpressionRegulière.accepteTout;

  get identifiantGestionnaireRéseau() {
    return this.#identifiantGestionnaireRéseau;
  }

  get référenceDossierRaccordementExpressionRegulière() {
    return this.#référenceDossierRaccordementExpressionRegulière;
  }

  async ajouter({
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    identifiantGestionnaireRéseau,
    raisonSociale,
    contactEmail,
  }: AjouterOptions) {
    if (this.exists) {
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

  async modifier({
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    identifiantGestionnaireRéseau,
    raisonSociale,
    contactEmail,
  }: ModifierOptions) {
    if (!this.exists) {
      throw new GestionnaireRéseauInconnuError();
    }
    // TODO : publish l'event uniquement si pas deep equal avec l'état de l'aggregate.
    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié-V2',
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

  apply({
    payload: {
      codeEIC,
      aideSaisieRéférenceDossierRaccordement: { expressionReguliere },
    },
  }: GestionnaireRéseauEvent): void {
    this.#identifiantGestionnaireRéseau =
      IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC);
    this.#référenceDossierRaccordementExpressionRegulière = match(expressionReguliere)
      .with('', () => ExpressionRegulière.accepteTout)
      .with(Pattern.nullish, () => ExpressionRegulière.accepteTout)
      .otherwise((value) => ExpressionRegulière.convertirEnValueType(value));
  }
}
