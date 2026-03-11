import { assert } from 'chai';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { LauréatWorld } from '../lauréat.world.js';

import { TransmettreAttestationConformitéFixture } from './fixture/transmettreAttestationConformité.fixture.js';
import { CalculerDateAchèvementPrévisionnelFixture } from './fixture/calculerDateAchèvementPrévisionnel.fixture.js';
import { TransmettreDateAchèvementFixture } from './fixture/transmettreDateAchèvement.fixture.js';
import { ModifierAttestationConformitéFixture } from './fixture/modifierAttestationConformité.fixture.js';
import { EnregistrerAttestationConformitéFixture } from './fixture/enregistrerAttestationConformité.fixture.js';

export class AchèvementWorld {
  #transmettreAttestationConformitéFixture: TransmettreAttestationConformitéFixture;
  #enregistrerAttestationConformitéFixture: EnregistrerAttestationConformitéFixture;
  #modifierAttestationConformitéFixture: ModifierAttestationConformitéFixture;
  #calculerDateAchèvementPrévisionnelFixture: CalculerDateAchèvementPrévisionnelFixture;
  #transmettreDateAchèvementFixture: TransmettreDateAchèvementFixture;

  get transmettreAttestationConformitéFixture() {
    return this.#transmettreAttestationConformitéFixture;
  }

  get enregistrerAttestationConformitéFixture() {
    return this.#enregistrerAttestationConformitéFixture;
  }

  get modifierAttestationConformitéFixture() {
    return this.#modifierAttestationConformitéFixture;
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
    this.#modifierAttestationConformitéFixture = new ModifierAttestationConformitéFixture(lauréat);
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
    if (this.modifierAttestationConformitéFixture.aÉtéCréé) {
      result = {
        ...result,
        ...this.modifierAttestationConformitéFixture.mapToExpected(identifiantProjet),
      };
    }

    return result;
  }

  mapToAttestation(): { format: string; content: string } | undefined {
    if (this.modifierAttestationConformitéFixture.attestation) {
      return this.modifierAttestationConformitéFixture.attestation;
    }
    if (this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      return this.transmettreAttestationConformitéFixture.attestation;
    }
    if (this.enregistrerAttestationConformitéFixture.aÉtéCréé) {
      return this.enregistrerAttestationConformitéFixture.attestation;
    }
  }

  mapToPreuveTransmissionAuCocontractant(): { format: string; content: string } | undefined {
    if (this.modifierAttestationConformitéFixture.aÉtéCréé) {
      return this.modifierAttestationConformitéFixture.preuve;
    }
    return this.transmettreAttestationConformitéFixture.preuve;
  }
}
