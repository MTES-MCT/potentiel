import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

import { LauréatAggregate } from '../lauréat.aggregate';

import { TypeDocumentAchèvement } from '.';

import { AchèvementEvent } from './achèvement.event';
import { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';
import { TransmettreAttestationConformitéOptions } from './transmettre/transmettreAttestationConformité.option';
import {
  AttestationDeConformitéDéjàTransmiseError,
  AucuneAttestationDeConformitéÀCorrigerError,
  DateDeTransmissionAuCoContractantFuturError,
} from './achèvement.error';
import { ModifierAttestationConformitéOptions } from './modifier/modifierAttestationConformité.option';
import { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';

export class AchèvementAggregate extends AbstractAggregate<AchèvementEvent> {
  #lauréat!: LauréatAggregate;
  get lauréat() {
    return this.#lauréat;
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

  async init(lauréat: LauréatAggregate) {
    this.#lauréat = lauréat;
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
    this.lauréat.vérifierQueLeCahierDesChargesPermetUnChangement();

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
      TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
      date,
      attestation.format,
    );

    this.#preuveTransmissionAuCocontractant = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAchèvement.attestationConformitéPreuveTransmissionValueType.formatter(),
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
      TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
      date,
      attestation.format,
    );

    this.#preuveTransmissionAuCocontractant = DocumentProjet.convertirEnValueType(
      identifiantProjet,
      TypeDocumentAchèvement.attestationConformitéPreuveTransmissionValueType.formatter(),
      dateTransmissionAuCocontractant,
      preuveTransmissionAuCocontractant.format,
    );
  }
}
