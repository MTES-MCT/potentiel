import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { LauréatWorld } from '../lauréat.world';

import { TransmettreAttestationConformitéFixture } from './fixture/transmettreAttestationConformité.fixture';
import { CalculerDateAchèvementPrévisionnelFixture } from './fixture/calculerDateAchèvementPrévisionnel.fixture';
import { TransmettreDateAchèvementFixture } from './fixture/transmettreDateAchèvement.fixture';
import { ModifierAttestationConformitéFixture } from './fixture/modifierAttestationConformité.fixture';

export class AchèvementWorld {
  #transmettreAttestationConformitéFixture: TransmettreAttestationConformitéFixture;
  #modifierAttestationConformitéFixture: ModifierAttestationConformitéFixture;
  #calculerDateAchèvementPrévisionnelFixture: CalculerDateAchèvementPrévisionnelFixture;
  #transmettreDateAchèvementFixture: TransmettreDateAchèvementFixture;

  get transmettreAttestationConformitéFixture() {
    return this.#transmettreAttestationConformitéFixture;
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
        ...this.transmettreDateAchèvementFixture.mapToExpected(identifiantProjet),
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
    if (this.modifierAttestationConformitéFixture.aÉtéCréé) {
      return this.modifierAttestationConformitéFixture.attestation;
    }
    return this.transmettreAttestationConformitéFixture.attestation;
  }

  mapToPreuveTransmissionAuCocontractant(): { format: string; content: string } | undefined {
    if (this.modifierAttestationConformitéFixture.aÉtéCréé) {
      return this.modifierAttestationConformitéFixture.preuve;
    }
    return this.transmettreAttestationConformitéFixture.preuve;
  }
}
