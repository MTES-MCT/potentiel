import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate.js';
import { GarantiesFinancières } from '../index.js';
import { DocumentProjet } from '../../index.js';

import { TypeDocumentProducteur } from './index.js';

import { EnregistrerChangementProducteurOptions } from './changement/enregistrerChangement/enregistrerChangement.option.js';
import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event.js';
import { ProducteurEvent } from './producteur.event.js';
import { ProducteurModifiéEvent } from './modifier/modifierProducteur.event.js';
import { ModifierOptions } from './modifier/modifierProducteur.option.js';
import { ImporterOptions } from './importer/importerProducteur.option.js';
import { ProducteurImportéEvent } from './importer/importerProducteur.event.js';
import { ProducteurIdentiqueError, ProducteurDéjàTransmisError } from './producteur.error.js';

export class ProducteurAggregate extends AbstractAggregate<
  ProducteurEvent,
  'producteur',
  LauréatAggregate
> {
  producteur!: string;

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
  }: EnregistrerChangementProducteurOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('information-enregistrée', 'producteur');

    if (this.producteur === producteur) {
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
      await this.lauréat.projet.lauréat.garantiesFinancières.demander({
        demandéLe: dateChangement,
        motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur,
        dateLimiteSoumission: dateChangement.ajouterNombreDeMois(2),
      });
    }
  }

  async modifier({
    producteur,
    dateModification,
    identifiantUtilisateur,
    raison,
    pièceJustificative,
  }: ModifierOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.producteur === producteur) {
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
      },
    };

    await this.publish(event);
  }

  async importer({ producteur, dateImport, identifiantUtilisateur }: ImporterOptions) {
    if (this.producteur) {
      throw new ProducteurDéjàTransmisError();
    }

    const event: ProducteurImportéEvent = {
      type: 'ProducteurImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        producteur,
        importéLe: dateImport.formatter(),
        importéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
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
    },
  }: ChangementProducteurEnregistréEvent) {
    const ancienProducteur = this.producteur;
    const dateChangement = DateTime.convertirEnValueType(enregistréLe);

    this.changements.set(dateChangement.formatter(), {
      enregistréLe: dateChangement,
      enregistréPar: Email.convertirEnValueType(enregistréPar),
      ancienProducteur,
      nouveauProducteur,
      raison,
      pièceJustificative: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        TypeDocumentProducteur.pièceJustificative.formatter(),
        enregistréLe,
        pièceJustificative?.format,
      ),
    });

    this.producteur = nouveauProducteur;
  }

  private applyProducteurModifiéV1({
    payload: { producteur: nouveauProducteur },
  }: ProducteurModifiéEvent) {
    this.producteur = nouveauProducteur;
  }

  private applyProducteurImportéV1({ payload: { producteur } }: ProducteurImportéEvent) {
    this.producteur = producteur;
  }
}
