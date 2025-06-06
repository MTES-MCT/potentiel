import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { TypeFournisseur } from '.';

import { FournisseurEvent } from './fournisseur.event';
import { ImporterOptions } from './importer/importerFournisseur.option';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event';
import { ModifierÉvaluationCarboneOptions } from './modifier/modifierÉvaluationCarbone.options';
import { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';

export class FournisseurAggregate extends AbstractAggregate<FournisseurEvent> {
  #lauréat!: LauréatAggregate;

  fournisseurs!: Array<{
    typeFournisseur: TypeFournisseur.ValueType;
    nomDuFabricant: string;
  }>;

  évaluationCarboneSimplifiée!: number;

  get lauréat() {
    return this.#lauréat;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
  }

  async importer({
    évaluationCarboneSimplifiée,
    importéLe,
    identifiantUtilisateur,
    fournisseurs,
  }: ImporterOptions) {
    const event: FournisseurImportéEvent = {
      type: 'FournisseurImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        évaluationCarboneSimplifiée,
        fournisseurs: fournisseurs.map((fournisseur) => ({
          typeFournisseur: fournisseur.typeFournisseur.formatter(),
          nomDuFabricant: fournisseur.nomDuFabricant,
        })),
        importéLe: importéLe.formatter(),
        importéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifierÉvaluationCarbone({
    modifiéeLe,
    modifiéePar,
    évaluationCarboneSimplifiée,
  }: ModifierÉvaluationCarboneOptions) {
    const event: ÉvaluationCarboneModifiéeEvent = {
      type: 'ÉvaluationCarboneModifiée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        modifiéeLe: modifiéeLe.formatter(),
        modifiéePar: modifiéePar.formatter(),
        évaluationCarboneSimplifiée,
      },
    };
    await this.publish(event);
  }

  apply(event: FournisseurEvent): void {
    match(event)
      .with(
        {
          type: 'FournisseurImporté-V1',
        },
        this.applyFournisseurImportéV1.bind(this),
      )
      .with(
        {
          type: 'ÉvaluationCarboneModifiée-V1',
        },
        this.applyÉvaluationCarboneModifiéeV1.bind(this),
      )
      .exhaustive();
  }

  private applyFournisseurImportéV1({
    payload: { évaluationCarboneSimplifiée, fournisseurs },
  }: FournisseurImportéEvent) {
    this.évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
    this.fournisseurs = fournisseurs.map((fournisseur) => ({
      typeFournisseur: TypeFournisseur.convertirEnValueType(fournisseur.typeFournisseur),
      nomDuFabricant: fournisseur.nomDuFabricant,
    }));
  }

  private applyÉvaluationCarboneModifiéeV1({
    payload: { évaluationCarboneSimplifiée },
  }: ÉvaluationCarboneModifiéeEvent) {
    this.évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
  }
}
