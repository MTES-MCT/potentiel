import { match, Pattern } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Email, ExpressionRegulière } from '@potentiel-domain/common';

import { GestionnaireRéseauAjoutéEvent } from './ajouter/ajouterGestionnaireRéseau.event.js';
import * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType.js';
import { GestionnaireRéseauModifiéEvent } from './modifier/modifierGestionnaireRéseau.event.js';
import { AjouterOptions } from './ajouter/ajouterGestionnaireRéseau.options.js';
import { GestionnaireRéseauEvent } from './gestionnaireRéseau.event.js';
import { ModifierOptions } from './modifier/modifierGestionnaireRéseau.options.js';
import {
  GestionnaireRéseauDéjàExistantError,
  GestionnaireRéseauInconnuError,
  GestionnaireRéseauNonModifiéError,
} from './gestionnaireRéseau.errors.js';

export class GestionnaireRéseauAggregate extends AbstractAggregate<
  GestionnaireRéseauEvent,
  'gestionnaire-réseau'
> {
  raisonSociale!: string;

  #référenceDossierRaccordementExpressionRegulière = ExpressionRegulière.accepteTout;
  #format?: string;
  #légende?: string;
  #contactEmail?: Email.ValueType;

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
          format: format || '',
          légende: légende || '',
          expressionReguliere: expressionReguliere
            ? expressionReguliere.formatter()
            : ExpressionRegulière.accepteTout.formatter(),
        },
        contactEmail: contactEmail ? contactEmail.formatter() : '',
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
    this.vérifierQueLaModificationEstPossible({
      aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
      raisonSociale,
      contactEmail,
    });

    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié-V2',
      payload: {
        codeEIC: this.identifiantGestionnaireRéseau.formatter(),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement: {
          format: format || '',
          légende: légende || '',
          expressionReguliere: expressionReguliere
            ? expressionReguliere.formatter()
            : ExpressionRegulière.accepteTout.formatter(),
        },
        contactEmail: contactEmail ? contactEmail.formatter() : '',
      },
    };

    await this.publish(event);
  }

  vérifierQueLeGestionnaireExiste() {
    if (!this.exists) {
      throw new GestionnaireRéseauInconnuError();
    }
  }

  vérifierQueLaModificationEstPossible({
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    raisonSociale,
    contactEmail,
  }: ModifierOptions) {
    if (
      this.raisonSociale === raisonSociale &&
      ((!contactEmail && !this.#contactEmail) ||
        (contactEmail && this.#contactEmail && contactEmail.estÉgaleÀ(this.#contactEmail))) &&
      format === this.#format &&
      légende === this.#légende &&
      ((!expressionReguliere && !this.#référenceDossierRaccordementExpressionRegulière) ||
        (expressionReguliere &&
          this.#référenceDossierRaccordementExpressionRegulière &&
          expressionReguliere.estÉgaleÀ(this.#référenceDossierRaccordementExpressionRegulière)))
    ) {
      throw new GestionnaireRéseauNonModifiéError();
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
