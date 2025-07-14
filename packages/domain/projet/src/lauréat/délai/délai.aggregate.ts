import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';

import { StatutDemandeDélai } from '.';

import { DélaiEvent } from './délai.event';
import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import { DemanderDélaiOptions } from './demande/demander/demanderDélai.options';
import { DélaiAccordéEvent } from './demande/accorder/accorderDemandeDélai.event';
import { AnnulerDemandeDélaiOptions } from './demande/annuler/annulerDemandeDélai.options';
import { DemandeDeDélaiInexistanteError } from './errors';
import { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';
import { RejeterDemandeDélaiOptions } from './demande/rejeter/rejeterDemandeDélai.options';
import { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event';

export class DélaiAggregate extends AbstractAggregate<DélaiEvent, 'délai', LauréatAggregate> {
  #demande?: {
    statut: StatutDemandeDélai.ValueType;
    nombreDeMois: number;
    demandéLe: DateTime.RawType;
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
        pièceJustificative: { format: pièceJustificative.format },
        raison,
        demandéLe: dateDemande.formatter(),
        demandéPar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async annulerDemandeDélai({
    identifiantUtilisateur,
    dateAnnulation,
  }: AnnulerDemandeDélaiOptions) {
    if (!this.#demande) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.annulé);

    const event: DemandeDélaiAnnuléeEvent = {
      type: 'DemandeDélaiAnnulée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
        dateDemande: this.#demande.demandéLe,
      },
    };

    await this.publish(event);
  }

  async rejeterDemandeDélai({ rejetéeLe, rejetéePar, réponseSignée }: RejeterDemandeDélaiOptions) {
    if (!this.#demande) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.rejeté);

    const event: DemandeDélaiRejetéeEvent = {
      type: 'DemandeDélaiRejetée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateDemande: this.#demande.demandéLe,
        réponseSignée: { format: réponseSignée.format },
        rejetéeLe: rejetéeLe.formatter(),
        rejetéePar: rejetéePar.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: DélaiEvent) {
    match(event)
      .with({ type: 'DélaiDemandé-V1' }, this.applyDélaiDemandé.bind(this))
      .with({ type: 'DélaiAccordé-V1' }, this.applyDélaiAccordé.bind(this))
      .with({ type: 'DemandeDélaiAnnulée-V1' }, this.applyDemandeDélaiAnnulée.bind(this))
      .with({ type: 'DemandeDélaiRejetée-V1' }, this.applyDemandeDélaiRejetée.bind(this))
      .exhaustive();
  }

  private applyDélaiDemandé({ payload: { nombreDeMois, demandéLe } }: DélaiDemandéEvent) {
    this.#demande = { statut: StatutDemandeDélai.demandé, nombreDeMois, demandéLe };
  }
  private applyDemandeDélaiAnnulée() {
    this.#demande = undefined;
  }

  private applyDemandeDélaiRejetée(_: DemandeDélaiRejetéeEvent) {
    this.#demande = undefined;
  }

  private applyDélaiAccordé(_: DélaiAccordéEvent) {}
}
