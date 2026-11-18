import { match, P } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
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
import type { DemandeDélaiAnnuléeEvent } from './demande/annuler/annulerDemandeDélai.event.js';
import type { AnnulerDemandeDélaiOptions } from './demande/annuler/annulerDemandeDélai.options.js';
import type { DemandeDélaiCorrigéeEvent } from './demande/corriger/corrigerDemandeDélai.event.js';
import type { CorrigerDemandeDélaiOptions } from './demande/corriger/corrigerDemandeDélai.options.js';
import type {
  DélaiDemandéEvent,
  DélaiDemandéEventV1,
} from './demande/demander/demanderDélai.event.js';
import type { DemanderDélaiOptions } from './demande/demander/demanderDélai.options.js';
import type { PasserEnInstructionDemandeDélaiOptions } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.option.js';
import type { DemandeDélaiRejetéeEvent } from './demande/rejeter/rejeterDemandeDélai.event.js';
import type { RejeterDemandeDélaiOptions } from './demande/rejeter/rejeterDemandeDélai.options.js';
import { DélaiEnCoursErreur } from './demande/statutDemandeDélai.valueType.js';
import type { DemandeDélaiSuppriméeEvent } from './demande/supprimer/supprimerDemandeDélai.event.js';
import type { SupprimerDemandeDélaiOptions } from './demande/supprimer/supprimerDemandeDélai.options.js';
import {
  DemandeDeDélaiInexistanteError,
  DemandeDélaiDéjàInstruiteParLeMêmeUtilisateurDreal,
  RôleNonAutoriséError,
} from './délai.error.js';
import type { DélaiEvent } from './délai.event.js';
import {
  AutoritéCompétente,
  type DemandeDélaiPasséeEnInstructionEvent,
  MotifDemandeDélai,
  StatutDemandeDélai,
} from './index.js';

type Demande = {
  statut: StatutDemandeDélai.ValueType;
  nombreDeMois: number;
  demandéLe: DateTime.RawType;
  raison: string;

  instruction?: {
    passéEnInstructionPar: Email.ValueType;
  };

  motif: MotifDemandeDélai.ValueType;
};
export class DélaiAggregate extends AbstractAggregate<DélaiEvent, 'délai', LauréatAggregate> {
  #demandes: Map<DateTime.RawType, Demande> = new Map();

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  private getDemande({ dateDemande }: { dateDemande: DateTime.ValueType }) {
    return this.#demandes.get(dateDemande.formatter());
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

    if (this.#demandes.values().find((v) => v.motif.estÉgaleÀ(motif))) {
      throw new DélaiEnCoursErreur(motif.formatter());
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
    pièceJustificative,
    raison,
    dateDemande,
  }: CorrigerDemandeDélaiOptions) {
    const demandeActuelle = this.getDemande({ dateDemande });

    if (!demandeActuelle) {
      throw new DemandeDeDélaiInexistanteError();
    }

    this.vérifierSiCorrectionEstValide({
      nombreDeMois,
      pièceJustificative,
      raison,
      dateDemande,
    });

    const event: DemandeDélaiCorrigéeEvent = {
      type: 'DemandeDélaiCorrigée-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        corrigéeLe: dateCorrection.formatter(),
        corrigéePar: identifiantUtilisateur.formatter(),
        dateDemande: demandeActuelle.demandéLe,
        nombreDeMois,
        raison,
        pièceJustificative: pièceJustificative ? { format: pièceJustificative.format } : undefined,
        motifDemande: demandeActuelle.motif.formatter(),
      },
    };

    await this.publish(event);
  }

  async annulerDemandeDélai({
    identifiantUtilisateur,
    dateAnnulation,
    dateDemande,
  }: AnnulerDemandeDélaiOptions) {
    const demandeActuelle = this.getDemande({ dateDemande });
    if (!demandeActuelle) {
      throw new DemandeDeDélaiInexistanteError();
    }
    demandeActuelle.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.annulé);

    const event: DemandeDélaiAnnuléeEvent = {
      type: 'DemandeDélaiAnnulée-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: dateAnnulation.formatter(),
        annuléPar: identifiantUtilisateur.formatter(),
        dateDemande: demandeActuelle.demandéLe,
        motifDemande: demandeActuelle.motif.formatter(),
      },
    };

    await this.publish(event);
  }

  async supprimerDemandesDélai({
    identifiantUtilisateur,
    dateSuppression,
  }: SupprimerDemandeDélaiOptions) {
    for (const demande of this.#demandes.values()) {
      const event: DemandeDélaiSuppriméeEvent = {
        type: 'DemandeDélaiSupprimée-V2',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
          suppriméLe: dateSuppression.formatter(),
          suppriméPar: identifiantUtilisateur.formatter(),
          dateDemande: demande.demandéLe,
          motifDemande: demande.motif.formatter(),
        },
      };
      await this.publish(event);
    }
  }

  async rejeterDemandeDélai({
    dateRejet,
    identifiantUtilisateur,
    rôleUtilisateur,
    réponseSignée,
    dateDemande,
  }: RejeterDemandeDélaiOptions) {
    const demandeActuelle = this.getDemande({ dateDemande });
    if (!demandeActuelle) {
      throw new DemandeDeDélaiInexistanteError();
    }
    demandeActuelle.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.rejeté);
    this.vérifierInstructeur(demandeActuelle.motif, rôleUtilisateur);

    const event: DemandeDélaiRejetéeEvent = {
      type: 'DemandeDélaiRejetée-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateDemande: demandeActuelle.demandéLe,
        réponseSignée: { format: réponseSignée.format },
        rejetéeLe: dateRejet.formatter(),
        rejetéePar: identifiantUtilisateur.formatter(),
        motifDemande: demandeActuelle.motif.formatter(),
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
    dateDemande,
  }: AccorderDemandeDélaiOptions) {
    const demandeActuelle = this.getDemande({ dateDemande });
    if (!demandeActuelle) {
      throw new DemandeDeDélaiInexistanteError();
    }

    const motifDemande = demandeActuelle.motif;

    demandeActuelle.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutDemandeDélai.accordé);

    this.vérifierInstructeur(motifDemande, rôleUtilisateur);

    const dateAchèvementPrévisionnelCalculée =
      demandeActuelle.motif.estProlongationDélaiAchèvement()
        ? await this.parent.achèvement.getDateAchèvementPrévisionnelCalculée({
            type: 'délai-accordé',
            nombreDeMois,
          })
        : this.parent.achèvement.dateAchèvementPrévisionnel.formatter();

    const délaiAccordéEvent: DélaiAccordéEvent = {
      type: 'DélaiAccordé-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateDemande: demandeActuelle.demandéLe,
        nombreDeMois,
        dateAchèvementPrévisionnelCalculée,
        accordéLe: dateAccord.formatter(),
        accordéPar: identifiantUtilisateur.formatter(),
        réponseSignée: { format: réponseSignée.format },
        motifDemande: motifDemande.formatter(),
      },
    };

    await this.publish(délaiAccordéEvent);

    if (motifDemande.estProlongationDélaiAchèvement()) {
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
    dateDemande,
  }: PasserEnInstructionDemandeDélaiOptions) {
    const demandeActuelle = this.getDemande({ dateDemande });
    if (!demandeActuelle) {
      throw new DemandeDeDélaiInexistanteError();
    }

    demandeActuelle.statut.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutDemandeDélai.enInstruction,
    );
    this.vérifierInstructeur(demandeActuelle.motif, rôleUtilisateur);

    if (demandeActuelle.instruction?.passéEnInstructionPar.estÉgaleÀ(identifiantUtilisateur)) {
      throw new DemandeDélaiDéjàInstruiteParLeMêmeUtilisateurDreal();
    }

    const event: Lauréat.Délai.DemandeDélaiPasséeEnInstructionEvent = {
      type: 'DemandeDélaiPasséeEnInstruction-V2',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        passéeEnInstructionLe: datePassageEnInstruction.formatter(),
        passéeEnInstructionPar: identifiantUtilisateur.formatter(),
        dateDemande: demandeActuelle.demandéLe,
        motifDemande: demandeActuelle.motif.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: DélaiEvent) {
    match(event)
      .with({ type: 'DélaiDemandé-V1' }, this.applyDélaiDemandéV1.bind(this))
      .with({ type: 'DélaiDemandé-V2' }, this.applyDélaiDemandé.bind(this))
      .with(
        { type: P.union('DemandeDélaiCorrigée-V1', 'DemandeDélaiCorrigée-V2') },
        this.applyDemandeDélaiCorrigée.bind(this),
      )
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
      .with(
        { type: P.union('DélaiAccordé-V1', 'DélaiAccordé-V2') },
        this.applyDemandeDélaiAccordée.bind(this),
      )
      .with(
        { type: P.union('DemandeDélaiSupprimée-V1', 'DemandeDélaiSupprimée-V2') },
        this.applyDemandeDélaiSupprimée.bind(this),
      )
      .exhaustive();
  }

  private applyDélaiDemandéV1({
    payload: { nombreDeMois, demandéLe, raison },
  }: DélaiDemandéEventV1) {
    this.#demandes.set(demandéLe, {
      statut: StatutDemandeDélai.demandé,
      nombreDeMois,
      demandéLe,
      raison,
      motif: MotifDemandeDélai.prolongationDélaiAchèvement,
    });
  }

  private applyDélaiDemandé({
    payload: { nombreDeMois, demandéLe, raison, motif },
  }: DélaiDemandéEvent) {
    this.#demandes.set(demandéLe, {
      statut: StatutDemandeDélai.demandé,
      nombreDeMois,
      demandéLe,
      raison,
      motif: MotifDemandeDélai.convertirEnValueType(motif),
    });
  }

  private applyDemandeDélaiCorrigée({
    payload: { nombreDeMois, raison, dateDemande },
  }: DemandeDélaiCorrigéeEvent) {
    const demandeActuelle = this.getDemande({
      dateDemande: DateTime.convertirEnValueType(dateDemande),
    });
    if (demandeActuelle) {
      demandeActuelle.nombreDeMois = nombreDeMois;
      demandeActuelle.raison = raison;
    }
  }

  private applyDemandeDélaiAnnulée({ payload: { dateDemande } }: DemandeDélaiAnnuléeEvent) {
    this.#demandes.delete(dateDemande);
  }

  private applyDemandeDélaiSupprimée({ payload: { dateDemande } }: DemandeDélaiSuppriméeEvent) {
    this.#demandes.delete(dateDemande);
  }

  private applyDemandeDélaiPasséeEnInstruction({
    payload: { passéeEnInstructionPar, dateDemande },
  }: DemandeDélaiPasséeEnInstructionEvent) {
    const demandeActuelle = this.getDemande({
      dateDemande: DateTime.convertirEnValueType(dateDemande),
    });
    if (demandeActuelle) {
      demandeActuelle.statut = StatutDemandeDélai.enInstruction;
      demandeActuelle.instruction = {
        passéEnInstructionPar: Email.convertirEnValueType(passéeEnInstructionPar),
      };
    }
  }

  private applyDemandeDélaiRejetée({ payload: { dateDemande } }: DemandeDélaiRejetéeEvent) {
    this.#demandes.delete(dateDemande);
  }

  private applyDemandeDélaiAccordée({
    payload: { dateDemande },
  }: DélaiAccordéEvent | DélaiAccordéEventV1) {
    this.#demandes.delete(dateDemande);
  }

  private vérifierSiCorrectionEstValide({
    nombreDeMois,
    pièceJustificative,
    raison,
    dateDemande,
  }: Pick<
    CorrigerDemandeDélaiOptions,
    'nombreDeMois' | 'pièceJustificative' | 'raison' | 'dateDemande'
  >) {
    const demandeActuelle = this.getDemande({ dateDemande });
    if (!demandeActuelle?.statut.estEnCours()) {
      throw new DemandeDeDélaiInexistanteError();
    }

    if (
      !pièceJustificative &&
      nombreDeMois === demandeActuelle.nombreDeMois &&
      raison === demandeActuelle.raison
    ) {
      throw new AucuneModificationApportéeError();
    }
  }

  private vérifierInstructeur(motif: MotifDemandeDélai.ValueType, rôleUtilisateur: Role.ValueType) {
    const autorité = AutoritéCompétente.convertirEnValueType(
      this.lauréat.projet.cahierDesChargesActuel.getAutoritéCompétente({ domain: 'délai', motif }),
    );
    if (!autorité.estCompétent(rôleUtilisateur)) {
      throw new RôleNonAutoriséError();
    }
  }
}
