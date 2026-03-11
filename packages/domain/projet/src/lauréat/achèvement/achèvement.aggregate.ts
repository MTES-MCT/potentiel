import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate.js';
import { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate.js';
import { ProjetAbandonnéError } from '../abandon/abandon.error.js';
import { Lauréat } from '../../index.js';

import { DateAchèvementPrévisionnel, TypeTâchePlanifiéeAchèvement } from './index.js';

import { TransmettreAttestationConformitéOptions } from './transmettre/transmettreAttestationConformité.option.js';
import { EnregistrerAttestationConformitéOptions } from './enregistrer/enregistrerAttestationConformité.option.js';
import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event.js';
import { ModifierAttestationConformitéOptions } from './modifier/modifierAttestationConformité.option.js';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event.js';
import { AchèvementEvent, AttestationConformitéEnregistréeEvent } from './achèvement.event.js';
import { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event.js';
import { CalculerDateAchèvementPrévisionnelOptions } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.option.js';
import {
  AttestationConformitéDéjàEnregistréeError,
  AttestationDeConformitéNonModifiéeError,
  DateAchèvementAntérieureÀDateNotificationError,
  DateAchèvementDansLeFuturError,
  DateDeTransmissionAuCoContractantFuturError,
  ProjetDéjàAchevéError,
  ProjetNonAchevéError,
} from './achèvement.error.js';
import { TransmettreDateAchèvementOptions } from './transmettre/transmettreDateAchèvement.option.js';
import { DateAchèvementTransmiseEvent } from './transmettre/transmettreDateAchèvement.event.js';

export class AchèvementAggregate extends AbstractAggregate<
  AchèvementEvent,
  'achevement',
  LauréatAggregate
> {
  #tâchePlanifiéeRappelÉchéanceTroisMois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappelÉchéanceDeuxMois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappelÉchéanceUnMois!: AggregateType<TâchePlanifiéeAggregate>;

  get lauréat() {
    return this.parent;
  }

  get délaiRéalisationEnMois() {
    return this.lauréat.projet.cahierDesChargesActuel.getDélaiRéalisationEnMois();
  }

  #dateAchèvementPrévisionnel!: DateAchèvementPrévisionnel.ValueType;
  get dateAchèvementPrévisionnel() {
    return this.#dateAchèvementPrévisionnel;
  }

  #estAchevé: boolean = false;
  get estAchevé() {
    return this.#estAchevé;
  }

  #dateAchèvementRéel: DateTime.ValueType | undefined;
  get dateAchèvementRéel() {
    return this.#dateAchèvementRéel;
  }

  #attestationConformitéTransmise = false;
  get attestationConformitéTransmise() {
    return this.#attestationConformitéTransmise;
  }

  async init() {
    this.#tâchePlanifiéeRappelÉchéanceTroisMois = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeAchèvement.rappelÉchéanceTroisMois.type,
    );
    this.#tâchePlanifiéeRappelÉchéanceDeuxMois = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeAchèvement.rappelÉchéanceDeuxMois.type,
    );
    this.#tâchePlanifiéeRappelÉchéanceUnMois = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeAchèvement.rappelÉchéanceUnMois.type,
    );
  }

  private vérifierDateAchèvementPostérieureDateNotification(dateAchèvement: DateTime.ValueType) {
    if (dateAchèvement.estAntérieurÀ(this.lauréat.notifiéLe)) {
      throw new DateAchèvementAntérieureÀDateNotificationError();
    }
  }

  async getDateAchèvementPrévisionnelCalculée(
    options: CalculerDateAchèvementPrévisionnelOptions,
  ): Promise<DateAchèvementPrévisionnel.RawType> {
    const duréeInstructionEdfOaEnJours = 1;

    const date = match(options)
      .with({ type: 'notification' }, () =>
        DateAchèvementPrévisionnel.convertirEnValueType(this.lauréat.notifiéLe.date)
          .ajouterDélai(this.délaiRéalisationEnMois)
          .dateTime.retirerNombreDeJours(duréeInstructionEdfOaEnJours)
          .formatter(),
      )
      .with({ type: 'délai-accordé' }, ({ nombreDeMois }) =>
        this.#dateAchèvementPrévisionnel.ajouterDélai(nombreDeMois).formatter(),
      )
      .with({ type: 'ajout-délai-cdc-30_08_2022' }, ({ nombreDeMois }) =>
        this.#dateAchèvementPrévisionnel.ajouterDélai(nombreDeMois).formatter(),
      )
      .with({ type: 'retrait-délai-cdc-30_08_2022' }, ({ nombreDeMois }) =>
        this.#dateAchèvementPrévisionnel.retirerDélai(nombreDeMois).formatter(),
      )
      .exhaustive();

    return date;
  }

  async calculerDateAchèvementPrévisionnel(
    options: CalculerDateAchèvementPrévisionnelOptions,
  ): Promise<DateAchèvementPrévisionnel.RawType> {
    const identifiantProjet = this.lauréat.projet.identifiantProjet.formatter();

    const date = await this.getDateAchèvementPrévisionnelCalculée(options);

    const event: DateAchèvementPrévisionnelCalculéeEvent = {
      type: 'DateAchèvementPrévisionnelCalculée-V1',
      payload: {
        identifiantProjet,
        date,
        raison: options.type,
      },
    };

    await this.publish(event);
    await this.planifierTâchesRappelsÉchéance(DateTime.convertirEnValueType(date));

    return date;
  }

  async transmettreAttestationConformité({
    identifiantProjet,
    identifiantUtilisateur,
    attestation,
    date,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
  }: TransmettreAttestationConformitéOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.lauréat.vérifierNiAbandonnéNiEnCoursAbandon();
    if (dateTransmissionAuCocontractant.estDansLeFutur()) {
      throw new DateDeTransmissionAuCoContractantFuturError();
    }

    this.vérifierDateAchèvementPostérieureDateNotification(dateTransmissionAuCocontractant);

    if (this.estAchevé) {
      throw new ProjetDéjàAchevéError();
    }

    const event: AttestationConformitéTransmiseEvent = {
      type: 'AttestationConformitéTransmise-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        attestation,
        dateTransmissionAuCocontractant: dateTransmissionAuCocontractant.formatter(),
        preuveTransmissionAuCocontractant,
        date: date.formatter(),
        utilisateur: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);

    await this.lauréat.garantiesFinancières.annulerTâchesPlanififées();
    await this.lauréat.garantiesFinancières.annulerTâchePorteurDemanderGarantiesFinancières();
    await this.annulerTâchesPlanifiéesRappelsÉchéance();
    await this.lauréat.modifierStatut({
      modifiéLe: date,
      statut: Lauréat.StatutLauréat.achevé,
      modifiéPar: Email.système,
    });
  }

  async modifierAttestationConformité({
    identifiantProjet,
    identifiantUtilisateur,
    attestation,
    date,
    dateTransmissionAuCocontractant,
    preuveTransmissionAuCocontractant,
  }: ModifierAttestationConformitéOptions) {
    if (dateTransmissionAuCocontractant.estDansLeFutur()) {
      throw new DateDeTransmissionAuCoContractantFuturError();
    }

    this.vérifierDateAchèvementPostérieureDateNotification(dateTransmissionAuCocontractant);

    if (!this.estAchevé) {
      throw new ProjetNonAchevéError();
    }

    if (
      !attestation &&
      !preuveTransmissionAuCocontractant &&
      this.dateAchèvementRéel &&
      dateTransmissionAuCocontractant.estÉgaleÀ(this.dateAchèvementRéel)
    ) {
      throw new AttestationDeConformitéNonModifiéeError();
    }

    const event: AttestationConformitéModifiéeEvent = {
      type: 'AttestationConformitéModifiée-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        attestation,
        dateTransmissionAuCocontractant: dateTransmissionAuCocontractant.formatter(),
        preuveTransmissionAuCocontractant,
        date: date.formatter(),
        utilisateur: identifiantUtilisateur.formatter(),
      },
    };

    await this.publish(event);
  }

  async enregistrerAttestationConformité({
    identifiantProjet,
    attestationConformité: { format },
    enregistréeLe,
    enregistréePar,
  }: EnregistrerAttestationConformitéOptions) {
    if (!this.estAchevé) {
      throw new ProjetNonAchevéError();
    }

    if (this.attestationConformitéTransmise) {
      throw new AttestationConformitéDéjàEnregistréeError();
    }

    const event: AttestationConformitéEnregistréeEvent = {
      type: 'AttestationConformitéEnregistrée-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        attestationConformité: { format },
        enregistréeLe: enregistréeLe.formatter(),
        enregistréePar: enregistréePar.formatter(),
      },
    };
    await this.publish(event);
  }

  async transmettreDateAchèvement({
    dateAchèvement,
    transmiseLe,
    transmisePar,
  }: TransmettreDateAchèvementOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.#estAchevé) {
      throw new ProjetDéjàAchevéError();
    }

    if (this.lauréat.statut.estAbandonné()) {
      throw new ProjetAbandonnéError();
    }

    this.vérifierDateAchèvementPostérieureDateNotification(dateAchèvement);

    if (dateAchèvement.estDansLeFutur()) {
      throw new DateAchèvementDansLeFuturError();
    }

    const event: DateAchèvementTransmiseEvent = {
      type: 'DateAchèvementTransmise-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        dateAchèvement: dateAchèvement.formatter(),
        transmiseLe: transmiseLe.formatter(),
        transmisePar: transmisePar.formatter(),
      },
    };

    await this.publish(event);

    await this.annulerTâchesPlanifiéesRappelsÉchéance();
    await this.lauréat.garantiesFinancières.annulerTâchesPlanififées();
    await this.lauréat.garantiesFinancières.annulerTâchePorteurDemanderGarantiesFinancières();
    await this.lauréat.modifierStatut({
      modifiéLe: transmiseLe,
      statut: Lauréat.StatutLauréat.achevé,
      modifiéPar: Email.système,
    });
  }

  async planifierTâchesRappelsÉchéance(dateAchèvementPrévisionnelle: DateTime.ValueType) {
    if (
      this.lauréat.projet.cahierDesChargesActuel.appelOffre.id !== 'PPE2 - Petit PV Bâtiment' ||
      this.#estAchevé ||
      this.lauréat.abandon.statut.estEnCours() ||
      this.lauréat.statut.estAbandonné()
    ) {
      return;
    }

    if (dateAchèvementPrévisionnelle.retirerNombreDeMois(3).estDansLeFutur()) {
      await this.#tâchePlanifiéeRappelÉchéanceTroisMois.ajouter({
        àExécuterLe: dateAchèvementPrévisionnelle.retirerNombreDeMois(3),
      });
    }

    if (dateAchèvementPrévisionnelle.retirerNombreDeMois(2).estDansLeFutur()) {
      await this.#tâchePlanifiéeRappelÉchéanceDeuxMois.ajouter({
        àExécuterLe: dateAchèvementPrévisionnelle.retirerNombreDeMois(2),
      });
    }

    if (dateAchèvementPrévisionnelle.retirerNombreDeMois(1).estDansLeFutur()) {
      await this.#tâchePlanifiéeRappelÉchéanceUnMois.ajouter({
        àExécuterLe: dateAchèvementPrévisionnelle.retirerNombreDeMois(1),
      });
    }
  }

  async annulerTâchesPlanifiéesRappelsÉchéance() {
    await this.#tâchePlanifiéeRappelÉchéanceTroisMois.annuler();
    await this.#tâchePlanifiéeRappelÉchéanceDeuxMois.annuler();
    await this.#tâchePlanifiéeRappelÉchéanceUnMois.annuler();
  }

  apply(event: AchèvementEvent): void {
    match(event)
      .with(
        { type: 'AttestationConformitéTransmise-V1' },
        this.applyAttestationConformitéTransmiseV1.bind(this),
      )
      .with(
        { type: 'AttestationConformitéModifiée-V1' },
        this.applyAttestationConformitéModifiéeV1.bind(this),
      )
      .with(
        { type: 'DateAchèvementPrévisionnelCalculée-V1' },
        this.applyDateAchèvementPrévisionnelCalculéeV1.bind(this),
      )
      .with({ type: 'DateAchèvementTransmise-V1' }, this.applyDateAchèvementTransmiseV1.bind(this))
      .with(
        { type: 'AttestationConformitéEnregistrée-V1' },
        this.applyAttestationConformitéEnregistréeV1.bind(this),
      )
      .exhaustive();
  }

  private applyAttestationConformitéTransmiseV1({
    payload: { dateTransmissionAuCocontractant },
  }: AttestationConformitéTransmiseEvent) {
    this.#estAchevé = true;

    this.#dateAchèvementRéel = DateTime.convertirEnValueType(dateTransmissionAuCocontractant);
    this.#attestationConformitéTransmise = true;
  }

  private applyAttestationConformitéModifiéeV1({
    payload: { dateTransmissionAuCocontractant, attestation },
  }: AttestationConformitéModifiéeEvent) {
    this.#dateAchèvementRéel = DateTime.convertirEnValueType(dateTransmissionAuCocontractant);
    if (attestation) {
      this.#attestationConformitéTransmise = true;
    }
  }

  private applyAttestationConformitéEnregistréeV1(_: AttestationConformitéEnregistréeEvent) {
    this.#attestationConformitéTransmise = true;
  }

  private applyDateAchèvementPrévisionnelCalculéeV1({
    payload: { date },
  }: DateAchèvementPrévisionnelCalculéeEvent) {
    this.#dateAchèvementPrévisionnel = DateAchèvementPrévisionnel.convertirEnValueType(date);
  }

  private applyDateAchèvementTransmiseV1(_: DateAchèvementTransmiseEvent) {
    this.#estAchevé = true;
  }
}
