import { assert } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';

import type { PièceJustificative } from '#helpers';
import type { LauréatWorld } from '../lauréat.world.js';
import { CalculerDateAchèvementPrévisionnelFixture } from './fixture/calculerDateAchèvementPrévisionnel.fixture.js';
import { EnregistrerAttestationConformitéFixture } from './fixture/enregistrerAttestationConformité.fixture.js';
import { ModifierAchèvementFixture } from './fixture/modifierAchèvement.fixture.js';
import { ModifierAttestationConformitéFixture } from './fixture/modifierAttestationConformité.fixture.js';
import { TransmettreAttestationConformitéFixture } from './fixture/transmettreAttestationConformité.fixture.js';
import { TransmettreDateAchèvementFixture } from './fixture/transmettreDateAchèvement.fixture.js';

export class AchèvementWorld {
  #transmettreAttestationConformitéFixture: TransmettreAttestationConformitéFixture;
  #enregistrerAttestationConformitéFixture: EnregistrerAttestationConformitéFixture;
  #modifierAttestationConformitéFixture: ModifierAttestationConformitéFixture;
  #modifierAchèvementFixture: ModifierAchèvementFixture;
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
    this.#modifierAttestationConformitéFixture = new ModifierAttestationConformitéFixture(lauréat);
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

  mapToExpected(): Lauréat.Achèvement.ConsulterAchèvementReadModel {
    let result: Lauréat.Achèvement.ConsulterAchèvementReadModel = {
      estAchevé: false,
      identifiantProjet: this.lauréat.identifiantProjet,
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
        ...this.transmettreAttestationConformitéFixture.mapToExpected(),
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
        ...this.enregistrerAttestationConformitéFixture.mapToExpected(),
      };
    }
    if (this.modifierAchèvementFixture.aÉtéCréé) {
      result = {
        ...result,
        ...this.modifierAchèvementFixture.mapToExpected(),
      };
    }

    if (this.modifierAttestationConformitéFixture.aÉtéCréé) {
      result = {
        ...result,
        ...this.modifierAttestationConformitéFixture.mapToExpected(),
      };
    }

    return result;
  }

  mapToAttestation(): PièceJustificative | undefined {
    if (this.modifierAchèvementFixture.aÉtéCréé) {
      return this.modifierAchèvementFixture.attestation;
    }
    if (this.modifierAttestationConformitéFixture.aÉtéCréé) {
      return this.modifierAttestationConformitéFixture.attestation;
    }

    if (this.enregistrerAttestationConformitéFixture.aÉtéCréé) {
      return this.enregistrerAttestationConformitéFixture.attestation;
    }

    if (this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      return this.transmettreAttestationConformitéFixture.attestation;
    }

    return undefined;
  }

  mapToRapportAssocié(): PièceJustificative | undefined {
    if (this.enregistrerAttestationConformitéFixture.aÉtéCréé) {
      return this.enregistrerAttestationConformitéFixture.rapportAssocié;
    }

    if (this.modifierAchèvementFixture.aÉtéCréé) {
      return this.modifierAchèvementFixture.rapportAssocié;
    }

    if (this.modifierAttestationConformitéFixture.aÉtéCréé) {
      return this.modifierAttestationConformitéFixture.rapportAssocié;
    }

    if (this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      return this.transmettreAttestationConformitéFixture.rapportAssocié;
    }

    return undefined;
  }

  mapToPreuveTransmissionAuCocontractant(): PièceJustificative | undefined {
    if (this.modifierAchèvementFixture.aÉtéCréé) {
      return this.modifierAchèvementFixture.preuve;
    }

    if (this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      return this.transmettreAttestationConformitéFixture.preuve;
    }

    return undefined;
  }
}
