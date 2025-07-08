import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';
// import { DateTime } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
// import { AppelOffreProjetSansTechnologieError } from '../lauréat.error';

import {
  AttestationDeConformitéDéjàTransmiseError,
  AucuneAttestationDeConformitéÀCorrigerError,
  DateDeTransmissionAuCoContractantFuturError,
} from './attestationConformité/attestationConformité.error';
import { TransmettreAttestationConformitéOptions } from './attestationConformité/transmettre/transmettreAttestationConformité.option';
import { AttestationConformitéModifiéeEvent } from './attestationConformité/modifier/modifierAttestationConformité.event';
import { ModifierAttestationConformitéOptions } from './attestationConformité/modifier/modifierAttestationConformité.option';
import { AttestationConformitéTransmiseEvent } from './attestationConformité/transmettre/transmettreAttestationConformité.event';
import { TypeDocumentAttestationConformité } from './attestationConformité';
import { AchèvementEvent, DatePrévisionnelleCalculéeEvent } from './achèvement.event';

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

  async calculerDatePrévisionnelle() {
    if (this.lauréat.notifiéLe) {
      // const getDelaiRealisationEnMois = () => {
      //   if (this.lauréat.projet.appelOffre.decoupageParTechnologie) {
      //     if (!this.lauréat.projet.appelOffre.technologie) {
      //       throw new AppelOffreProjetSansTechnologieError();
      //     }

      //     return this.lauréat.projet.appelOffre.delaiRealisationEnMoisParTechnologie[
      //       this.lauréat.projet.appelOffre.technologie
      //     ];
      //   } else {
      //     return this.lauréat.projet.appelOffre.delaiRealisationEnMois;
      //   }
      // };

      // const delaiRealisationEnMois = getDelaiRealisationEnMois();

      const event: DatePrévisionnelleCalculéeEvent = {
        type: 'DatePrévisionnelleCalculée-V1',
        payload: {
          identifiantProjet: this.lauréat.projet.identifiantProjet.formatter(),
          // date: DateTime.convertirEnValueType(this.lau)
          date: this.lauréat.notifiéLe.ajouterNombreDeMois(30).formatter(),
          // date: DateTime.convertirEnValueType(new Date('2027-04-30').toISOString()).formatter(),
        },
      };

      await this.publish(event);
    }
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
      .with(
        {
          type: 'DatePrévisionnelleCalculée-V1',
        },
        (event) => this.applyDatePrévisionnelleCalculéeV1(event),
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

  private applyDatePrévisionnelleCalculéeV1(_: DatePrévisionnelleCalculéeEvent) {}
}
