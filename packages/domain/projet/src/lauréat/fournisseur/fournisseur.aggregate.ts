import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { FournisseurEvent } from './fournisseur.event';
import { ImporterOptions } from './importer/importerFournisseur.option';
import { FournisseurImportéEvent } from './importer/importerFournisseur.event';

export class FournisseurAggregate extends AbstractAggregate<FournisseurEvent> {
  #lauréat!: LauréatAggregate;

  fournisseur!: string;

  évaluationCarboneSimplifiée!: number;

  get lauréat() {
    return this.#lauréat;
  }

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
  }

  async importer({
    identifiantProjet,
    évaluationCarboneSimplifiée,
    importéLe,
    identifiantUtilisateur,
  }: ImporterOptions) {
    const event: FournisseurImportéEvent = {
      type: 'FournisseurImporté-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        évaluationCarboneSimplifiée,
        details: 'coucou',
        importéLe: importéLe.formatter(),
        importéPar: identifiantUtilisateur.formatter(),
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
        (event) => this.applyFournisseurImportéV1(event),
      )
      .exhaustive();
  }

  private applyFournisseurImportéV1({
    payload: { évaluationCarboneSimplifiée },
  }: FournisseurImportéEvent) {
    this.évaluationCarboneSimplifiée = évaluationCarboneSimplifiée;
  }
}
