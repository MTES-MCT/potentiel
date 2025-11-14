import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { LauréatWorld } from '../lauréat.world';

import { TransmettreOuModifierAttestationConformitéFixture } from './fixture/transmettreOuModifierAttestationConformité.fixture';
import { CalculerDateAchèvementPrévisionnelFixture } from './fixture/calculerDateAchèvementPrévisionnel.fixture';

export class AchèvementWorld {
  #transmettreOuModifierAttestationConformitéFixture: TransmettreOuModifierAttestationConformitéFixture;
  #calculerDateAchèvementPrévisionnelFixture: CalculerDateAchèvementPrévisionnelFixture;

  get transmettreOuModifierAttestationConformitéFixture() {
    return this.#transmettreOuModifierAttestationConformitéFixture;
  }

  get calculerDateAchèvementPrévisionnelFixture() {
    return this.#calculerDateAchèvementPrévisionnelFixture;
  }

  constructor(private lauréat: LauréatWorld) {
    this.#transmettreOuModifierAttestationConformitéFixture =
      new TransmettreOuModifierAttestationConformitéFixture();
    this.#calculerDateAchèvementPrévisionnelFixture =
      new CalculerDateAchèvementPrévisionnelFixture();
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
  ): Option.Type<Lauréat.Achèvement.ConsulterAchèvementReadModel> {
    if (!this.transmettreOuModifierAttestationConformitéFixture.aÉtéCréé) {
      throw new Error(
        `Aucune transmission d'attestation de conformité n'a été crée dans AchèvementWorld`,
      );
    }

    const { dateTransmissionAuCocontractant, date, utilisateur, attestation, preuve } =
      this.#transmettreOuModifierAttestationConformitéFixture;

    return {
      identifiantProjet,
      estAchevé: true,
      dateAchèvementPrévisionnel:
        Lauréat.Achèvement.DateAchèvementPrévisionnel.convertirEnValueType(
          this.dateAchèvementPrévisionnelCalculée,
        ),
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(date).formatter(),
        attestation.format,
      ),
      dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
        dateTransmissionAuCocontractant,
      ),
      preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
        DateTime.convertirEnValueType(dateTransmissionAuCocontractant).formatter(),
        preuve.format,
      ),
      misÀJourLe: DateTime.convertirEnValueType(date),
      misÀJourPar: Email.convertirEnValueType(utilisateur),
    };
  }
}
