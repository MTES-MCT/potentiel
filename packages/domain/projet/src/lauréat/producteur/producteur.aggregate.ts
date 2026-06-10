import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { AbstractAggregate, type AggregateType } from '@potentiel-domain/core';

import { GarantiesFinancières } from '../index.js';
import type { LauréatAggregate } from '../lauréat.aggregate.js';
import { TypeTâche } from '../tâche/index.js';
import type { TâcheAggregate } from '../tâche/tâche.aggregate.js';
import type { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event.js';
import type { EnregistrerChangementProducteurOptions } from './changement/enregistrerChangement/enregistrerChangement.option.js';
import type { ProducteurImportéEvent } from './importer/importerProducteur.event.js';
import type { ImporterOptions } from './importer/importerProducteur.option.js';
import {
  DocumentProducteur,
  NuméroIdentification,
  type NuméroIdentificationCorrigéEvent,
} from './index.js';
import type { ProducteurModifiéEvent } from './modifier/modifierProducteur.event.js';
import type { ModifierOptions } from './modifier/modifierProducteur.option.js';
import type { CorrigerNuméroIdentificationOptions } from './numéroIdentification/corriger/corrigerNuméroIdentification.option.js';
import {
  NuméroIdentificationIdentiqueError,
  ProducteurDéjàTransmisError,
  ProducteurIdentiqueError,
} from './producteur.error.js';
import type { ProducteurEvent } from './producteur.event.js';

export class ProducteurAggregate extends AbstractAggregate<
  ProducteurEvent,
  'producteur',
  LauréatAggregate
> {
  #producteur!: string;
  #numéroIdentification: NuméroIdentification.ValueType | undefined;

  changements: Map<
    DateTime.RawType,
    {
      enregistréPar: Email.ValueType;
      enregistréLe: DateTime.ValueType;
      ancienProducteur: string;
      nouveauProducteur: string;
      raison?: string;
      pièceJustificative?: {
        format: string;
      };
    }
  > = new Map();

  // Tâches
  #tâcheRenseignerNuméroIdentification!: AggregateType<TâcheAggregate>;

  async init() {
    this.#tâcheRenseignerNuméroIdentification = await this.lauréat.loadTâche(
      TypeTâche.producteurRenseignerNuméroIdentification.type,
    );
  }

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async enregistrerChangement({
    identifiantProjet,
    producteur,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    numéroIdentification,
  }: EnregistrerChangementProducteurOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('information-enregistrée', 'producteur');

    if (this.#producteur === producteur) {
      throw new ProducteurIdentiqueError();
    }

    const event: ChangementProducteurEnregistréEvent = {
      type: 'ChangementProducteurEnregistré-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        producteur,
        enregistréLe: dateChangement.formatter(),
        enregistréPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
        numéroIdentification: numéroIdentification?.formatter(),
      },
    };

    await this.publish(event);

    await this.lauréat.projet.accès.retirerTous({
      retiréLe: dateChangement,
      retiréPar: identifiantUtilisateur,
      cause: 'changement-producteur',
    });

    await this.lauréat.garantiesFinancières.effacerHistorique({
      effacéLe: dateChangement,
      effacéPar: identifiantUtilisateur,
    });

    if (this.lauréat.projet.cahierDesChargesActuel.estSoumisAuxGarantiesFinancières()) {
      // TODO: Il faut attendre un peu ici car sinon l'exécution des projecteurs risque se faire en même temps
      // et générer des projections avec des données erronées
      // Idéalement il ne faudrait pas avoir des projecteur qui s'exécute en parallèle
      await new Promise((resolve) => setTimeout(resolve, 100));

      await this.lauréat.projet.lauréat.garantiesFinancières.demander({
        demandéLe: dateChangement,
        motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur,
        dateLimiteSoumission: dateChangement.ajouterNombreDeMois(2),
      });
    }

    if (numéroIdentification) {
      this.#tâcheRenseignerNuméroIdentification.achever();
    }
  }

  async modifier({
    producteur,
    dateModification,
    identifiantUtilisateur,
    raison,
    pièceJustificative,
    numéroIdentification,
  }: ModifierOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (
      this.#producteur === producteur &&
      ((!numéroIdentification && !this.#numéroIdentification) ||
        (numéroIdentification &&
          this.#numéroIdentification &&
          numéroIdentification.estÉgaleÀ(this.#numéroIdentification)))
    ) {
      throw new ProducteurIdentiqueError();
    }

    const event: ProducteurModifiéEvent = {
      type: 'ProducteurModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        producteur,
        modifiéLe: dateModification.formatter(),
        modifiéPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
        numéroIdentification: numéroIdentification?.formatter(),
      },
    };

    await this.publish(event);

    if (numéroIdentification) {
      this.#tâcheRenseignerNuméroIdentification.achever();
    }
  }

  async corrigerNuméroIdentification({
    identifiantProjet,
    dateCorrection,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
    numéroIdentification,
  }: CorrigerNuméroIdentificationOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('information-enregistrée', 'producteur');

    if (this.#numéroIdentification?.estÉgaleÀ(numéroIdentification)) {
      throw new NuméroIdentificationIdentiqueError();
    }

    const event: NuméroIdentificationCorrigéEvent = {
      type: 'NuméroIdentificationCorrigé-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        corrigéLe: dateCorrection.formatter(),
        corrigéPar: identifiantUtilisateur.formatter(),
        raison,
        pièceJustificative,
        numéroIdentification: numéroIdentification?.formatter(),
      },
    };

    this.#tâcheRenseignerNuméroIdentification.achever();

    await this.publish(event);
  }

  async importer({
    producteur,
    dateImport,
    identifiantUtilisateur,
    numéroIdentification,
  }: ImporterOptions) {
    if (this.#producteur) {
      throw new ProducteurDéjàTransmisError();
    }

    const event: ProducteurImportéEvent = {
      type: 'ProducteurImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        producteur,
        importéLe: dateImport.formatter(),
        importéPar: identifiantUtilisateur.formatter(),
        numéroIdentification: numéroIdentification?.formatter(),
      },
    };

    await this.publish(event);

    if (!numéroIdentification) {
      this.#tâcheRenseignerNuméroIdentification.ajouter();
    }
  }

  apply(event: ProducteurEvent): void {
    match(event)
      .with(
        {
          type: 'ChangementProducteurEnregistré-V1',
        },
        (event) => this.applyChangementProducteurEnregistréV1(event),
      )
      .with(
        {
          type: 'ProducteurModifié-V1',
        },
        (event) => this.applyProducteurModifiéV1(event),
      )
      .with(
        {
          type: 'NuméroIdentificationCorrigé-V1',
        },
        (event) => this.applyNuméroIdentificationCorrigéV1(event),
      )
      .with(
        {
          type: 'ProducteurImporté-V1',
        },
        (event) => this.applyProducteurImportéV1(event),
      )
      .exhaustive();
  }

  private applyChangementProducteurEnregistréV1({
    payload: {
      identifiantProjet,
      enregistréLe,
      enregistréPar,
      producteur: nouveauProducteur,
      raison,
      pièceJustificative,
      numéroIdentification,
    },
  }: ChangementProducteurEnregistréEvent) {
    const ancienProducteur = this.#producteur;
    const dateChangement = DateTime.convertirEnValueType(enregistréLe);

    this.changements.set(dateChangement.formatter(), {
      enregistréLe: dateChangement,
      enregistréPar: Email.convertirEnValueType(enregistréPar),
      ancienProducteur,
      nouveauProducteur,
      raison,
      pièceJustificative: DocumentProducteur.pièceJustificative({
        identifiantProjet,
        enregistréLe,
        pièceJustificative,
      }),
    });

    this.#producteur = nouveauProducteur;
    this.#numéroIdentification = numéroIdentification
      ? NuméroIdentification.convertirEnValueType(numéroIdentification)
      : undefined;
  }

  private applyProducteurModifiéV1({
    payload: { producteur: nouveauProducteur, numéroIdentification },
  }: ProducteurModifiéEvent) {
    this.#producteur = nouveauProducteur;
    this.#numéroIdentification = numéroIdentification
      ? NuméroIdentification.convertirEnValueType(numéroIdentification)
      : undefined;
  }

  private applyNuméroIdentificationCorrigéV1({
    payload: { numéroIdentification },
  }: NuméroIdentificationCorrigéEvent) {
    this.#numéroIdentification = NuméroIdentification.convertirEnValueType(numéroIdentification);
  }

  private applyProducteurImportéV1({
    payload: { producteur, numéroIdentification },
  }: ProducteurImportéEvent) {
    this.#producteur = producteur;
    this.#numéroIdentification = numéroIdentification
      ? NuméroIdentification.convertirEnValueType(numéroIdentification)
      : undefined;
  }
}
