import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LauréatAggregate } from '../lauréat.aggregate';
import { GarantiesFinancières } from '..';

import { TypeDocumentProducteur } from '.';

import { EnregistrerChangementProducteurOptions } from './changement/enregistrerChangement/enregistrerChangement.option';
import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import { ProducteurEvent } from './producteur.event';
import { ProducteurModifiéEvent } from './modifier/modifierProducteur.event';
import { ModifierOptions } from './modifier/modifierProducteur.option';
import { ImporterOptions } from './importer/importerProducteur.option';
import { ProducteurImportéEvent } from './importer/importerProducteur.event';
import {
  ProducteurIdentiqueError,
  AOEmpêcheChangementProducteurError,
  ProducteurDéjàTransmisError,
} from './producteur.error';

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

  async enregistrerChangement({
    identifiantProjet,
    producteur,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: EnregistrerChangementProducteurOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible();

    if (this.producteur === producteur) {
      throw new ProducteurIdentiqueError();
    }
    if (!this.lauréat.projet.appelOffre.changementProducteurPossibleAvantAchèvement) {
      throw new AOEmpêcheChangementProducteurError();
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
    await this.lauréat.projet.lauréat.garantiesFinancières.effacerHistorique({
      effacéLe: dateChangement,
      effacéPar: identifiantUtilisateur,
    });
    await this.lauréat.projet.lauréat.garantiesFinancières.demander({
      demandéLe: dateChangement,
      motif: GarantiesFinancières.MotifDemandeGarantiesFinancières.changementProducteur,
    });
  }

  async modifier({
    identifiantProjet,
    producteur,
    dateModification,
    identifiantUtilisateur,
  }: ModifierOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.producteur === producteur) {
      throw new ProducteurIdentiqueError();
    }

    const event: ProducteurModifiéEvent = {
      type: 'ProducteurModifié-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        producteur,
        modifiéLe: dateModification.formatter(),
        modifiéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async importer({
    identifiantProjet,
    producteur,
    dateImport,
    identifiantUtilisateur,
  }: ImporterOptions) {
    if (this.producteur) {
      throw new ProducteurDéjàTransmisError();
    }

    const event: ProducteurImportéEvent = {
      type: 'ProducteurImporté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
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
