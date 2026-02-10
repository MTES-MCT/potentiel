import { match, Pattern } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { ExpressionRegulière } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { GestionnaireRéseauAjoutéEvent } from './ajouter/ajouterGestionnaireRéseau.event.js';
import * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType.js';
import { GestionnaireRéseauModifiéEvent } from './modifier/modifierGestionnaireRéseau.event.js';
import { GestionnaireRéseauDéjàExistantError } from './gestionnaireRéseauDéjàExistant.error.js';
import { AjouterOptions } from './ajouter/ajouterGestionnaireRéseau.options.js';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau.event.js';
import { ModifierOptions } from './modifier/modifierGestionnaireRéseau.options.js';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error.js';

export class GestionnaireRéseauAggregate extends AbstractAggregate<
  GestionnaireRéseauEvent,
  'gestionnaire-réseau'
> {
  #référenceDossierRaccordementExpressionRegulière = ExpressionRegulière.accepteTout;

  get identifiantGestionnaireRéseau() {
    return IdentifiantGestionnaireRéseau.convertirEnValueType(this.aggregateId.split('|')[1]);
  }

  get référenceDossierRaccordementExpressionRegulière() {
    return this.#référenceDossierRaccordementExpressionRegulière;
  }

  async ajouter({
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    raisonSociale,
    contactEmail,
  }: AjouterOptions) {
    if (this.exists) {
      throw new GestionnaireRéseauDéjàExistantError();
    }

    const event: GestionnaireRéseauAjoutéEvent = {
      type: 'GestionnaireRéseauAjouté-V2',
      payload: {
        codeEIC: this.identifiantGestionnaireRéseau.formatter(),
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
    raisonSociale,
    contactEmail,
  }: ModifierOptions) {
    this.vérifierQueLeGestionnaireExiste();
    // TODO : publish l'event uniquement si pas deep equal avec l'état de l'aggregate.
    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié-V2',
      payload: {
        codeEIC: this.identifiantGestionnaireRéseau.formatter(),
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

  vérifierQueLeGestionnaireExiste() {
    if (!this.exists) {
      throw new GestionnaireRéseauInconnuError();
    }
  }

  apply({
    payload: {
      aideSaisieRéférenceDossierRaccordement: { expressionReguliere },
    },
  }: GestionnaireRéseauEvent): void {
    this.#référenceDossierRaccordementExpressionRegulière = match(expressionReguliere)
      .with('', () => ExpressionRegulière.accepteTout)
      .with(Pattern.nullish, () => ExpressionRegulière.accepteTout)
      .otherwise((value) => ExpressionRegulière.convertirEnValueType(value));
  }
}
