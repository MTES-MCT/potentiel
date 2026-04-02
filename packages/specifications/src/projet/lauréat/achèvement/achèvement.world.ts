import { assert } from 'chai';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { LauréatWorld } from '../lauréat.world.js';

import { TransmettreAttestationConformitéFixture } from './fixture/transmettreAttestationConformité.fixture.js';
import { CalculerDateAchèvementPrévisionnelFixture } from './fixture/calculerDateAchèvementPrévisionnel.fixture.js';
import { TransmettreDateAchèvementFixture } from './fixture/transmettreDateAchèvement.fixture.js';
import { ModifierAchèvementFixture } from './fixture/modifierAchèvement.fixture.js';
import { EnregistrerAttestationConformitéFixture } from './fixture/enregistrerAttestationConformité.fixture.js';

export class AchèvementWorld {
  #transmettreAttestationConformitéFixture: TransmettreAttestationConformitéFixture;
  #enregistrerAttestationConformitéFixture: EnregistrerAttestationConformitéFixture;
  #modifierAchèvementFixture: ModifierAchèvementFixture;
  #calculerDateAchèvementPrévisionnelFixture: CalculerDateAchèvementPrévisionnelFixture;
  #transmettreDateAchèvementFixture: TransmettreDateAchèvementFixture;

  get transmettreAttestationConformitéFixture() {
    return this.#transmettreAttestationConformitéFixture;
  }

  get enregistrerAttestationConformitéFixture() {
    return this.#enregistrerAttestationConformitéFixture;
  }

  get modifierAchèvementFixture() {
    return this.#modifierAchèvementFixture;
  }

  get calculerDateAchèvementPrévisionnelFixture() {
    return this.#calculerDateAchèvementPrévisionnelFixture;
  }

  get transmettreDateAchèvementFixture() {
    return this.#transmettreDateAchèvementFixture;
  }

  constructor(private lauréat: LauréatWorld) {
    this.#transmettreAttestationConformitéFixture = new TransmettreAttestationConformitéFixture(
      lauréat,
    );
    this.#enregistrerAttestationConformitéFixture = new EnregistrerAttestationConformitéFixture(
      lauréat,
    );
    this.#modifierAchèvementFixture = new ModifierAchèvementFixture(lauréat);
    this.#calculerDateAchèvementPrévisionnelFixture = new CalculerDateAchèvementPrévisionnelFixture(
      lauréat,
    );
    this.#transmettreDateAchèvementFixture = new TransmettreDateAchèvementFixture(lauréat);
  }

  get dateAchèvementPrévisionnelCalculée() {
    if (this.calculerDateAchèvementPrévisionnelFixture.aÉtéCréé) {
      return this.calculerDateAchèvementPrévisionnelFixture.dateAchèvementPrévisionnel;
    }
    return Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(
      this.lauréat.notifierLauréatFixture.notifiéLe,
    )
      .ajouterDélai(this.lauréat.cahierDesCharges.getDélaiRéalisationEnMois())
      .dateTime.retirerNombreDeJours(1) // délai EDFOA
      .formatter();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Lauréat.Achèvement.ConsulterAchèvementReadModel {
    let result: Lauréat.Achèvement.ConsulterAchèvementReadModel = {
      estAchevé: false,
      identifiantProjet,
      dateAchèvementPrévisionnel:
        Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(
          this.dateAchèvementPrévisionnelCalculée,
        ),
      aBénéficiéDuDélaiCDC2022: false,
    };

    if (this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      result = {
        ...result,
        estAchevé: true,
        ...this.transmettreAttestationConformitéFixture.mapToExpected(identifiantProjet),
      };
    }
    if (this.transmettreDateAchèvementFixture.aÉtéCréé) {
      result = {
        ...result,
        estAchevé: true,
        ...this.transmettreDateAchèvementFixture.mapToExpected(),
      };
    }
    if (this.enregistrerAttestationConformitéFixture.aÉtéCréé) {
      assert(
        result.estAchevé,
        'Le projet devrait être achevé pour enregistrer une attestation de conformité',
      );
      result = {
        ...result,
        estAchevé: true,
        dateAchèvementRéel: result.dateAchèvementRéel,
        ...this.enregistrerAttestationConformitéFixture.mapToExpected(identifiantProjet),
      };
    }
    if (this.modifierAchèvementFixture.aÉtéCréé) {
      result = {
        ...result,
        ...this.modifierAchèvementFixture.mapToExpected(identifiantProjet),
      };
    }

    return result;
  }

  mapToAttestation(): PièceJustificative | undefined {
    if (this.modifierAchèvementFixture.attestation) {
      return this.modifierAchèvementFixture.attestation;
    }
    if (this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      return this.transmettreAttestationConformitéFixture.attestation;
    }
    if (this.enregistrerAttestationConformitéFixture.aÉtéCréé) {
      return this.enregistrerAttestationConformitéFixture.attestation;
    }
  }

  mapToPreuveTransmissionAuCocontractant(): PièceJustificative | undefined {
    if (this.modifierAchèvementFixture.aÉtéCréé) {
      return this.modifierAchèvementFixture.preuve;
    }
    return this.transmettreAttestationConformitéFixture.preuve;
  }
}
