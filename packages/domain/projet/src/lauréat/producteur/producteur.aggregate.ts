import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { LauréatAggregate } from '../lauréat.aggregate';

import { TypeDocumentProducteur } from '.';

import { EnregistrerChangementProducteurOptions } from './changement/enregistrerChangement/enregistrerChangement.option';
import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';
import {
  ProducteurIdentiqueError,
  ProjetAbandonnéError,
  ProjetAvecDemandeAbandonEnCoursError,
  ProjetAchevéError,
  AOEmpêcheChangementProducteurError,
} from './changement/errors';
import { ProducteurEvent } from './producteur.event';
import { ProducteurModifiéEvent } from './modifier/modifierProducteur.event';
import { ModifierOptions } from './modifier/modifierProducteur.option';

export class ProducteurAggregate extends AbstractAggregate<ProducteurEvent> {
  #lauréat!: LauréatAggregate;

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
    return this.#lauréat;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;

    this.producteur = this.lauréat.projet.candidature.nomCandidat;
  }

  async enregistrerChangement({
    identifiantProjet,
    producteur,
    dateChangement,
    identifiantUtilisateur,
    pièceJustificative,
    raison,
  }: EnregistrerChangementProducteurOptions) {
    if (this.producteur === producteur) {
      throw new ProducteurIdentiqueError();
    }

    if (this.lauréat.projet.statut.estAbandonné()) {
      throw new ProjetAbandonnéError();
    }

    if (this.lauréat.abandon.statut.estEnCours()) {
      throw new ProjetAvecDemandeAbandonEnCoursError();
    }

    if (this.lauréat.projet.statut.estAchevé()) {
      throw new ProjetAchevéError();
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
}
