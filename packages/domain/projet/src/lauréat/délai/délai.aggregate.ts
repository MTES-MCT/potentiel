import { match, P } from 'ts-pattern';

import { type DateTime, Email } from '@potentiel-domain/common';
import { AbstractAggregate } from '@potentiel-domain/core';
import type { Role } from '@potentiel-domain/utilisateur';

import type { Lauréat } from '../../index.js';
import { AucuneModificationApportéeError } from '../../projet.error.js';
import type { LauréatAggregate } from '../lauréat.aggregate.js';
import type { AccorderDemandeDélaiOptions } from './demande/accorder/accorderDemandeDélai.options.js';
import type {
  DélaiAccordéEvent,
  DélaiAccordéEventV1,
} from './demande/accorder/accorderDélai.event.js';
import type {
  DemandeDélaiAnnuléeEvent,
  DemandeDélaiAnnuléeEventV1,
} from './demande/annuler/annulerDemandeDélai.event.js';
import type { AnnulerDemandeDélaiOptions } from './demande/annuler/annulerDemandeDélai.options.js';
import type {
  DemandeDélaiCorrigéeEvent,
  DemandeDélaiCorrigéeEventV1,
} from './demande/corriger/corrigerDemandeDélai.event.js';
import type { CorrigerDemandeDélaiOptions } from './demande/corriger/corrigerDemandeDélai.options.js';
import type {
  DélaiDemandéEvent,
  DélaiDemandéEventV1,
} from './demande/demander/demanderDélai.event.js';
import type { DemanderDélaiOptions } from './demande/demander/demanderDélai.options.js';
import type { PasserEnInstructionDemandeDélaiOptions } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.option.js';
import type { DemandeDélaiRejetéeEventV1 } from './demande/rejeter/rejeterDemandeDélai.event.js';
import type { RejeterDemandeDélaiOptions } from './demande/rejeter/rejeterDemandeDélai.options.js';
import type {
  DemandeDélaiSuppriméeEvent,
  DemandeDélaiSuppriméeEventV1,
} from './demande/supprimer/supprimerDemandeDélai.event.js';
import type { SupprimerDemandeDélaiOptions } from './demande/supprimer/supprimerDemandeDélai.options.js';
import {
  DemandeDeDélaiInexistanteError,
  DemandeDélaiDéjàInstruiteParLeMêmeUtilisateurDreal,
  RôleNonAutoriséError,
} from './délai.error.js';
import type {
  DemandeDélaiPasséeEnInstructionEvent,
  DemandeDélaiPasséeEnInstructionEventV1,
  DélaiEvent,
} from './délai.event.js';
import { AutoritéCompétente, MotifDemandeDélai, StatutDemandeDélai } from './index.js';

export class DélaiAggregate extends AbstractAggregate<DélaiEvent, 'délai', LauréatAggregate> {
  #demande?: {
    statut: StatutDemandeDélai.ValueType;
    nombreDeMois: number;
    demandéLe: DateTime.RawType;
    raison: string;

    instruction?: {
      passéEnInstructionPar: Email.ValueType;
    };
    motif: MotifDemandeDélai.ValueType;
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
    motif,
  }: DemanderDélaiOptions) {
    this.lauréat.vérifierQueLeChangementEstPossible('demande', 'délai');

    if (this.#demande) {
      this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.demandé);
    }

    const event: DélaiDemandéEvent = {
      type: 'DélaiDemandé-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nombreDeMois,
        pièceJustificative: { format: pièceJustificative.format },
        raison,
        demandéLe: dateDemande.formatter(),
        demandéPar: identifiantUtilisateur.formatter(),
        motif: motif.formatter(),
      },
    };

    await this.publish(event);
  }

  async corrigerDemandeDélai({
    identifiantUtilisateur,
    dateCorrection,
    nombreDeMois,
    motif,
    pièceJustificative,
    raison,
  }: CorrigerDemandeDélaiOptions) {
    if (!this.#demande) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.vérifierSiCorrectionEstValide({
      nombreDeMois,
      pièceJustificative,
      raison,
      motif,
    });

    const event: DemandeDélaiCorrigéeEvent = {
      type: 'DemandeDélaiCorrigée-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        corrigéeLe: dateCorrection.formatter(),
        corrigéePar: identifiantUtilisateur.formatter(),
        dateDemande: this.#demande.demandéLe,
        nombreDeMois,
        motif: motif.formatter(),
        raison,
        pièceJustificative: pièceJustificative ? { format: pièceJustificative.format } : undefined,
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

    const event: DemandeDélaiAnnuléeEventV1 = {
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

  async supprimerDemandeDélai({
    identifiantUtilisateur,
    dateSuppression,
  }: SupprimerDemandeDélaiOptions) {
    if (!this.#demande) {
      return;
    }

    const event: DemandeDélaiSuppriméeEventV1 = {
      type: 'DemandeDélaiSupprimée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        suppriméLe: dateSuppression.formatter(),
        suppriméPar: identifiantUtilisateur.formatter(),
        dateDemande: this.#demande.demandéLe,
      },
    };

    await this.publish(event);
  }

  async rejeterDemandeDélai({
    dateRejet,
    identifiantUtilisateur,
    rôleUtilisateur,
    réponseSignée,
  }: RejeterDemandeDélaiOptions) {
    if (!this.#demande) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.rejeté);
    this.verifierInstructeur(this.#demande.motif, rôleUtilisateur);

    const event: DemandeDélaiRejetéeEventV1 = {
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

  async accorderDemandeDélai({
    dateAccord,
    identifiantUtilisateur,
    réponseSignée,
    nombreDeMois,
    rôleUtilisateur,
    motif,
  }: AccorderDemandeDélaiOptions) {
    if (!this.#demande) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.accordé);
    this.verifierInstructeur(this.#demande.motif, rôleUtilisateur);

    const dateAchèvementPrévisionnelCalculée = motif.estProlongationPhaseEssai()
      ? this.parent.achèvement.dateAchèvementPrévisionnel.formatter()
      : await this.parent.achèvement.getDateAchèvementPrévisionnelCalculée({
          type: 'délai-accordé',
          nombreDeMois,
        });

    const délaiAccordéEvent: DélaiAccordéEvent = {
      type: 'DélaiAccordé-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateDemande: this.#demande.demandéLe,
        nombreDeMois,
        dateAchèvementPrévisionnelCalculée,
        accordéLe: dateAccord.formatter(),
        accordéPar: identifiantUtilisateur.formatter(),
        réponseSignée: { format: réponseSignée.format },
        motifDemande: motif.formatter(),
      },
    };

    await this.publish(délaiAccordéEvent);

    if (motif.estProlongationDélaiAchèvement()) {
      await this.parent.achèvement.calculerDateAchèvementPrévisionnel({
        type: 'délai-accordé',
        nombreDeMois,
      });
    }
  }

  async passerEnInstructionDemandeDélai({
    identifiantUtilisateur,
    datePassageEnInstruction,
    rôleUtilisateur,
  }: PasserEnInstructionDemandeDélaiOptions) {
    if (!this.#demande) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.#demande.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutDemandeDélai.enInstruction,
    );
    this.verifierInstructeur(this.#demande.motif, rôleUtilisateur);

    if (this.#demande.instruction?.passéEnInstructionPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new DemandeDélaiDéjàInstruiteParLeMêmeUtilisateurDreal();
    }

    const event: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent = {
      type: 'DemandeDélaiPasséeEnInstruction-V2',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        passéeEnInstructionLe: datePassageEnInstruction.formatter(),
        passéeEnInstructionPar: identifiantUtilisateur.formatter(),
        dateDemande: this.#demande.demandéLe,
        motifDemande: this.#demande.motif.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: DélaiEvent) {
    match(event)
      .with({ type: 'DélaiDemandé-V1' }, this.applyDélaiDemandéV1.bind(this))
      .with({ type: 'DélaiDemandé-V2' }, this.applyDélaiDemandé.bind(this))
      .with({ type: 'DemandeDélaiCorrigée-V1' }, this.applyDemandeDélaiCorrigéeV1.bind(this))
      .with({ type: 'DemandeDélaiCorrigée-V2' }, this.applyDemandeDélaiCorrigée.bind(this))
      .with(
        { type: P.union('DemandeDélaiAnnulée-V1', 'DemandeDélaiAnnulée-V2') },
        this.applyDemandeDélaiAnnulée.bind(this),
      )
      .with(
        {
          type: P.union('DemandeDélaiPasséeEnInstruction-V1', 'DemandeDélaiPasséeEnInstruction-V2'),
        },
        this.applyDemandeDélaiPasséeEnInstruction.bind(this),
      )
      .with(
        { type: P.union('DemandeDélaiRejetée-V1', 'DemandeDélaiRejetée-V2') },
        this.applyDemandeDélaiRejetée.bind(this),
      )
      .with({ type: 'DélaiAccordé-V1' }, this.applyDemandeDélaiAccordée.bind(this))
      .with({ type: 'DélaiAccordé-V2' }, this.applyDemandeDélaiAccordée.bind(this))
      .with(
        { type: P.union('DemandeDélaiSupprimée-V1', 'DemandeDélaiSupprimée-V2') },
        this.applyDemandeDélaiSupprimée.bind(this),
      )
      .exhaustive();
  }

  private applyDélaiDemandéV1({
    payload: { nombreDeMois, demandéLe, raison },
  }: DélaiDemandéEventV1) {
    this.#demande = {
      statut: StatutDemandeDélai.demandé,
      nombreDeMois,
      demandéLe,
      raison,
      motif: MotifDemandeDélai.prolongationDélaiAchèvement,
    };
  }

  private applyDélaiDemandé({
    payload: { nombreDeMois, demandéLe, raison, motif },
  }: DélaiDemandéEvent) {
    this.#demande = {
      statut: StatutDemandeDélai.demandé,
      nombreDeMois,
      demandéLe,
      raison,
      motif: MotifDemandeDélai.convertirEnValueType(motif),
    };
  }

  private applyDemandeDélaiCorrigéeV1({
    payload: { nombreDeMois, raison },
  }: DemandeDélaiCorrigéeEventV1) {
    if (this.#demande) {
      this.#demande.nombreDeMois = nombreDeMois;
      this.#demande.raison = raison;
    }
  }

  private applyDemandeDélaiCorrigée({
    payload: { nombreDeMois, raison, motif },
  }: DemandeDélaiCorrigéeEvent) {
    if (this.#demande) {
      this.#demande.nombreDeMois = nombreDeMois;
      this.#demande.raison = raison;
      this.#demande.motif = MotifDemandeDélai.convertirEnValueType(motif);
    }
  }

  private applyDemandeDélaiAnnulée(_: DemandeDélaiAnnuléeEvent | DemandeDélaiAnnuléeEventV1) {
    this.#demande = undefined;
  }

  private applyDemandeDélaiSupprimée(_: DemandeDélaiSuppriméeEvent | DemandeDélaiSuppriméeEventV1) {
    this.#demande = undefined;
  }

  private applyDemandeDélaiPasséeEnInstruction({
    payload: { passéeEnInstructionPar },
  }: DemandeDélaiPasséeEnInstructionEventV1 | DemandeDélaiPasséeEnInstructionEvent) {
    if (this.#demande) {
      this.#demande.statut = StatutDemandeDélai.enInstruction;
      this.#demande.instruction = {
        passéEnInstructionPar: Email.convertirEnValueType(passéeEnInstructionPar),
      };
    }
  }

  private applyDemandeDélaiRejetée(_: DemandeDélaiRejetéeEventV1) {
    this.#demande = undefined;
  }

  private applyDemandeDélaiAccordée(_: DélaiAccordéEvent | DélaiAccordéEventV1) {
    this.#demande = undefined;
  }

  private vérifierSiCorrectionEstValide({
    nombreDeMois,
    pièceJustificative,
    raison,
    motif,
  }: Pick<
    CorrigerDemandeDélaiOptions,
    'nombreDeMois' | 'pièceJustificative' | 'raison' | 'motif'
  >) {
    if (!this.#demande?.statut.estEnCours()) {
      throw new DemandeDeDélaiInexistanteError();
    }

    if (
      !pièceJustificative &&
      nombreDeMois === this.#demande.nombreDeMois &&
      raison === this.#demande.raison &&
      motif.estÉgaleÀ(this.#demande.motif)
    ) {
      throw new AucuneModificationApportéeError();
    }
  }

  private verifierInstructeur(motif: MotifDemandeDélai.ValueType, rôleUtilisateur: Role.ValueType) {
    const autorité = AutoritéCompétente.convertirEnValueType(
      this.lauréat.projet.cahierDesChargesActuel.getAutoritéCompétente({ domain: 'délai', motif }),
    );
    if (!autorité.estCompétent(rôleUtilisateur)) {
      throw new RôleNonAutoriséError();
    }
  }
}
