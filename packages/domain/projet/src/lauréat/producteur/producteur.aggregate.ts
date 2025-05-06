// import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
// import { DocumentProjet } from '@potentiel-domain/document';

import { LauréatAggregate } from '../lauréat.aggregate';

import { EnregistrerChangementProducteurOptions } from './changement/enregistrerChangement/enregistrerChangement.option';
import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event';

// import { TypeDocumentProducteur } from '.';

// import { ProducteurEvent } from './producteur.event';
// import { AucunProducteurEnCours } from './producteur.error';

export class ProducteurAggregate extends AbstractAggregate<ProducteurEvent> {
  #lauréat!: LauréatAggregate;

  producteur!: string;

  changement: {
    enregistréPar: Email.ValueType;
    enregistréLe: DateTime.ValueType;
    ancienProducteur: string;
    nouveauProducteur: string;
    raison?: string;
    pièceJustificative?: {
      format: string;
    };
  } = {
    enregistréPar: Email.unknownUser,
    enregistréLe: DateTime.convertirEnValueType(new Date()),
    ancienProducteur: '',
    nouveauProducteur: '',
  };

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

    if (estAbandonné) {
      throw new ProjetAbandonnéError();
    }

    if (demandeAbandonEnCours) {
      throw new ProjetAvecDemandeAbandonEnCoursError();
    }

    if (estAchevé) {
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

  apply(event: ProducteurEvent): void {
    // match(event)
    //   .with(
    //     {
    //       type: 'ProducteurAccordé-V1',
    //     },
    //     (event) => this.applyProducteurAccordéV1(event),
    //   )
    //   .with(
    //     {
    //       type: 'ProducteurAnnulé-V1',
    //     },
    //     (event) => this.applyProducteurAnnuléV1(event),
    //   )
    //   .with(
    //     {
    //       type: 'ProducteurImporté-V1',
    //     },
    //     (event) => this.applyProducteurImportéV1(event),
    //   )
    //   .with(
    //     {
    //       type: 'ProducteurRejeté-V1',
    //     },
    //     (event) => this.applyProducteurRejetéV1(event),
    //   )
    //   .with(
    //     {
    //       type: 'ProducteurPasséEnInstruction-V1',
    //     },
    //     (event) => this.applyProducteurPasséEnInstructionV1(event),
    //   )
    //   .exhaustive();
  }

  // private applyProducteurImportéV1({
  //   payload: { identifiantProjet, demandéLe, demandéPar, raison, pièceJustificative },
  // }: ProducteurImportéEvent) {
  //   this.statut = StatutProducteur.demandé;

  //   this.demande = {
  //     pièceJustificative:
  //       pièceJustificative &&
  //       DocumentProjet.convertirEnValueType(
  //         identifiantProjet,
  //         TypeDocumentProducteur.pièceJustificative.formatter(),
  //         demandéLe,
  //         pièceJustificative?.format,
  //       ),
  //     raison,
  //     demandéLe: DateTime.convertirEnValueType(demandéLe),
  //     demandéPar: Email.convertirEnValueType(demandéPar),
  //   };
  //   this.rejet = undefined;
  //   this.accord = undefined;
  //   this.annuléLe = undefined;
  // }
}
