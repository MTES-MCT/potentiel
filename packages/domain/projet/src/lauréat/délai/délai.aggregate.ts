import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate';

import { StatutDemandeDélai } from '.';

import { DélaiEvent } from './délai.event';
import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import { DemanderDélaiOptions } from './demande/demander/demanderDélai.options';
import { DélaiAccordéEvent } from './demande/accorder/accorderDemandeDélai.event';

export class DélaiAggregate extends AbstractAggregate<DélaiEvent, 'délai', LauréatAggregate> {
  #demande?: {
    statut: StatutDemandeDélai.ValueType;
    nombreDeMois: number;
  };

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async demanderDélai({
    identifiantUtilisateur,
    nombreDeMois,
    dateDemande,
    pièceJustificative,
    raison,
  }: DemanderDélaiOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible();

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.demandé);
    }

    const event: DélaiDemandéEvent = {
      type: 'DélaiDemandé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nombreDeMois,
        pièceJustificative: {
          format: pièceJustificative.format,
        },
        raison,
        demandéLe: dateDemande.formatter(),
        demandéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: DélaiEvent) {
    match(event)
      .with({ type: 'DélaiDemandé-V1' }, this.applyDélaiDemandé.bind(this))
      .with({ type: 'DélaiAccordé-V1' }, this.applyDélaiAccordé.bind(this))
      .exhaustive();
  }

  private applyDélaiDemandé({ payload: { nombreDeMois } }: DélaiDemandéEvent) {
    this.#demande = {
      statut: StatutDemandeDélai.demandé,
      nombreDeMois,
    };
  }

  private applyDélaiAccordé(_: DélaiAccordéEvent) {}
}
