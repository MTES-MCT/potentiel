import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet, IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

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

  constructor() {
    this.#transmettreOuModifierAttestationConformitéFixture =
      new TransmettreOuModifierAttestationConformitéFixture();
    this.#calculerDateAchèvementPrévisionnelFixture =
      new CalculerDateAchèvementPrévisionnelFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Option.Type<Lauréat.Achèvement.AttestationConformité.ConsulterAttestationConformitéReadModel> {
    if (!this.transmettreOuModifierAttestationConformitéFixture.aÉtéCréé) {
      throw new Error(
        `Aucune transmission d'attestation de conformité n'a été crée dans AchèvementWorld`,
      );
    }

    const { dateTransmissionAuCocontractant, date, utilisateur, attestation, preuve } =
      this.#transmettreOuModifierAttestationConformitéFixture;

    return {
      identifiantProjet,
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.AttestationConformité.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(date).formatter(),
        attestation.format,
      ),
      dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
        dateTransmissionAuCocontractant,
      ),
      preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.AttestationConformité.TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
        DateTime.convertirEnValueType(dateTransmissionAuCocontractant).formatter(),
        preuve.format,
      ),
      misÀJourLe: DateTime.convertirEnValueType(date),
      misÀJourPar: Email.convertirEnValueType(utilisateur),
    };
  }
}
