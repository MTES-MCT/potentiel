import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Achèvement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

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
  ): Option.Type<Achèvement.ConsulterAttestationConformitéReadModel> {
    if (!this.transmettreOuModifierAttestationConformitéFixture.aÉtéCréé) {
      throw new Error(
        `Aucune transmission d'attestation de conformité n'a été crée dans AchèvementWorld`,
      );
    }

    const {
      dateTransmissionAuCocontractant,
      date,
      utilisateur,
      document: { format },
    } = this.#transmettreOuModifierAttestationConformitéFixture;

    return {
      identifiantProjet,
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Achèvement.TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(date).formatter(),
        format,
      ),
      dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
        dateTransmissionAuCocontractant,
      ),
      preuveTransmissionAuCocontractant: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Achèvement.TypeDocumentAchèvement.attestationConformitéPreuveTransmissionValueType.formatter(),
        DateTime.convertirEnValueType(dateTransmissionAuCocontractant).formatter(),
        format,
      ),
      misÀJourLe: DateTime.convertirEnValueType(date),
      misÀJourPar: Email.convertirEnValueType(utilisateur),
    };
  }
}
