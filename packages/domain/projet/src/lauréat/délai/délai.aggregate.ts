import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
import { Lauréat } from '../..';

import { DemandeDélaiPasséeEnInstructionEvent, StatutDemandeDélai } from '.';

import { DélaiEvent } from './délai.event';
import { DélaiDemandéEvent } from './demande/demander/demanderDélai.event';
import { DemanderDélaiOptions } from './demande/demander/demanderDélai.options';
import { DélaiAccordéEvent } from './demande/accorder/accorderDemandeDélai.event';
import { AnnulerDemandeDélaiOptions } from './demande/annuler/annulerDemandeDélai.options';
import {
  DemandeDeDélaiInexistanteError,
  DemandeDélaiDéjàEnInstructionAvecLeMêmeUtilisateurDrealError,
} from './délai.error';
import { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event';
import { RejeterDemandeDélaiOptions } from './demande/rejeter/rejeterDemandeDélai.options';
import { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event';
import { PasserEnInstructionDemandeDélaiOptions } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.option';

export class DélaiAggregate extends AbstractAggregate<DélaiEvent, 'délai', LauréatAggregate> {
  #demande?: {
    statut: StatutDemandeDélai.ValueType;
    nombreDeMois: number;
    demandéLe: DateTime.RawType;

    instruction?: {
      passéEnInstructionPar: Email.ValueType;
    };
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

  async rejeterDemandeDélai({
    dateRejet,
    identifiantUtilisateur,
    réponseSignée,
  }: RejeterDemandeDélaiOptions) {
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
        rejetéeLe: dateRejet.formatter(),
        rejetéePar: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async passerEnInstructionDemandeDélai({
    identifiantUtilisateur,
    datePassageEnInstruction,
  }: PasserEnInstructionDemandeDélaiOptions) {
    if (!this.#demande) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutDemandeDélai.enInstruction,
    );

    if (this.#demande.instruction?.passéEnInstructionPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new DemandeDélaiDéjàEnInstructionAvecLeMêmeUtilisateurDrealError();
    }

    const event: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent = {
      type: 'DemandeDélaiPasséeEnInstruction-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        passéEnInstructionLe: datePassageEnInstruction.formatter(),
        passéEnInstructionPar: identifiantUtilisateur.formatter(),
        dateDemande: this.#demande.demandéLe,
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
      .with(
        { type: 'DemandeDélaiPasséeEnInstruction-V1' },
        this.applyDemandeDélaiPasséeEnInstruction.bind(this),
      )
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

  private applyDemandeDélaiPasséeEnInstruction({
    payload: { passéEnInstructionPar },
  }: DemandeDélaiPasséeEnInstructionEvent) {
    if (this.#demande) {
      this.#demande.statut = StatutDemandeDélai.enInstruction;
      this.#demande.instruction = {
        passéEnInstructionPar: Email.convertirEnValueType(passéEnInstructionPar),
      };
    }
  }

  private applyDélaiAccordé(_: DélaiAccordéEvent) {}
}
