import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate';
import { DocumentProjet } from '../../document-projet';
import { ProjetAbandonnéError } from '../abandon/abandon.error';

import {
  DateAchèvementPrévisionnel,
  TypeTâchePlanifiéeAchèvement,
  TypeDocumentAttestationConformité,
} from '.';

import { TransmettreAttestationConformitéOptions } from './transmettre/transmettreAttestationConformité.option';
import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';
import { ModifierAttestationConformitéOptions } from './modifier/modifierAttestationConformité.option';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';
import { AchèvementEvent } from './achèvement.event';
import { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event';
import { CalculerDateAchèvementPrévisionnelOptions } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.option';
import {
  AttestationDeConformitéDéjàTransmiseError,
  AucuneAttestationDeConformitéÀCorrigerError,
  DateAchèvementAntérieureÀDateNotificationError,
  DateAchèvementDansLeFuturError,
  DateDeTransmissionAuCoContractantFuturError,
  ProjetDéjàAchevéError,
} from './achèvement.error';
import { TransmettreDateAchèvementOptions } from './transmettre/transmettreDateAchèvement.option';
import { DateAchèvementTransmiseEvent } from './transmettre/transmettreDateAchèvement.event';

export class AchèvementAggregate extends AbstractAggregate<
  AchèvementEvent,
  'achevement',
  LauréatAggregate
> {
  get lauréat() {
    return this.parent;
  }

  #estAchevé: boolean = false;
  get estAchevé() {
    return this.#estAchevé;
  }

  #attestationConformité: Option.Type<DocumentProjet.ValueType> = Option.none;
  get attestationConformité() {
    return this.#attestationConformité;
  }

  #preuveTransmissionAuCocontractant: Option.Type<DocumentProjet.ValueType> = Option.none;
  get preuveTransmissionAuCocontractant() {
    return this.#preuveTransmissionAuCocontractant;
  }

  get délaiRéalisationEnMois() {
    return this.lauréat.projet.cahierDesChargesActuel.getDélaiRéalisationEnMois();
  }

  #dateAchèvementPrévisionnel!: DateAchèvementPrévisionnel.ValueType;
  get dateAchèvementPrévisionnel() {
    return this.#dateAchèvementPrévisionnel;
  }

  #tâchePlanifiéeRappelÉchéanceTroisMois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappelÉchéanceDeuxMois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappelÉchéanceUnMois!: AggregateType<TâchePlanifiéeAggregate>;

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

    if (
      Option.isSome(this.attestationConformité) &&
      Option.isSome(this.preuveTransmissionAuCocontractant)
    ) {
      throw new AttestationDeConformitéDéjàTransmiseError();
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
    await this.lauréat.garantiesFinancières.annulerTâchePorteurGarantiesFinancièresDemandée();
    await this.annulerTâchesPlanifiéesRappelsÉchéance();
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

    if (Option.isNone(this.attestationConformité)) {
      throw new AucuneAttestationDeConformitéÀCorrigerError();
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

  async transmettreDateAchèvement({
    dateAchèvement,
    attestation: { format },
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

    if (dateAchèvement.estAntérieurÀ(this.lauréat.notifiéLe)) {
      throw new DateAchèvementAntérieureÀDateNotificationError();
    }

    if (dateAchèvement.estDansLeFutur()) {
      throw new DateAchèvementDansLeFuturError();
    }

    const event: DateAchèvementTransmiseEvent = {
      type: 'DateAchèvementTransmise-V1',
      payload: {
        identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
        attestation: {
          format,
        },
        dateAchèvement: dateAchèvement.formatter(),
        transmiseLe: transmiseLe.formatter(),
        transmisePar: transmisePar.formatter(),
      },
    };

    await this.publish(event);
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
        {
          type: 'AttestationConformitéTransmise-V1',
        },
        (event) => this.applyAttestationConformitéTransmiseV1(event),
      )
      .with(
        {
          type: 'AttestationConformitéModifiée-V1',
        },
        (event) => this.applyAttestationConformitéModifiéeV1(event),
      )
      .with(
        {
          type: 'DateAchèvementPrévisionnelCalculée-V1',
        },
        (event) => this.applyDateAchèvementPrévisionnelCalculéeV1(event),
      )
      .with({ type: 'DateAchèvementTransmise-V1' }, (event) =>
        this.applyDateAchèvementTransmiseV1(event),
      )
      .exhaustive();
  }

  private applyAttestationConformitéTransmiseV1({
    payload: {
      identifiantProjet,
      attestation,
      date,
      preuveTransmissionAuCocontractant,
      dateTransmissionAuCocontractant,
    },
  }: AttestationConformitéTransmiseEvent) {
    this.#estAchevé = true;

    this.#attestationConformité = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
      date,
      attestation.format,
    );

    this.#preuveTransmissionAuCocontractant = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
      dateTransmissionAuCocontractant,
      preuveTransmissionAuCocontractant.format,
    );
  }

  private applyAttestationConformitéModifiéeV1({
    payload: {
      identifiantProjet,
      attestation,
      date,
      preuveTransmissionAuCocontractant,
      dateTransmissionAuCocontractant,
    },
  }: AttestationConformitéModifiéeEvent) {
    this.#attestationConformité = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
      date,
      attestation.format,
    );

    this.#preuveTransmissionAuCocontractant = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
      dateTransmissionAuCocontractant,
      preuveTransmissionAuCocontractant.format,
    );
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
