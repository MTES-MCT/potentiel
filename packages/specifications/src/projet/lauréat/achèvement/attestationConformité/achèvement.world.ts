import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { TransmettreOuModifierAttestationConformitéFixture } from './fixture/transmettreOuModifierAttestationConformité.fixture';

export class AchèvementWorld {
  #transmettreOuModifierAttestationConformitéFixture: TransmettreOuModifierAttestationConformitéFixture;

  get transmettreOuModifierAttestationConformitéFixture() {
    return this.#transmettreOuModifierAttestationConformitéFixture;
  }

  constructor() {
    this.#transmettreOuModifierAttestationConformitéFixture =
      new TransmettreOuModifierAttestationConformitéFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Option.Type<Lauréat.Achèvement.ConsulterAttestationConformitéReadModel> {
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
        Lauréat.Achèvement.TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(date).formatter(),
        attestation.format,
      ),
      dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
        dateTransmissionAuCocontractant,
      ),
      preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.TypeDocumentAchèvement.attestationConformitéPreuveTransmissionValueType.formatter(),
        DateTime.convertirEnValueType(dateTransmissionAuCocontractant).formatter(),
        preuve.format,
      ),
      misÀJourLe: DateTime.convertirEnValueType(date),
      misÀJourPar: Email.convertirEnValueType(utilisateur),
    };
  }
}
