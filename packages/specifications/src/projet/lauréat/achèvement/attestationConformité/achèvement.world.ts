import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { Achèvement } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { DocumentProjet } from '@potentiel-domain/document';

import { TransmettreAttestationConformitéFixture } from './fixture/transmettreAttestationConformité.fixture';
import { ModifierAttestationConformitéFixture } from './fixture/modifierAttestationConformité.fixture';

export class AchèvementWorld {
  #transmettreAttestationConformitéFixture: TransmettreAttestationConformitéFixture;
  #modifierAttestationConformitéFixture: ModifierAttestationConformitéFixture;

  get transmettreAttestationConformitéFixture() {
    return this.#transmettreAttestationConformitéFixture;
  }

  get modifierAttestationConformitéFixture() {
    return this.#modifierAttestationConformitéFixture;
  }

  constructor() {
    this.#transmettreAttestationConformitéFixture = new TransmettreAttestationConformitéFixture();
    this.#modifierAttestationConformitéFixture = new ModifierAttestationConformitéFixture();
  }

  mapToExpected(
    identifiantProjet: IdentifiantProjet.ValueType,
  ): Option.Type<Achèvement.ConsulterAttestationConformitéReadModel> {
    if (!this.transmettreAttestationConformitéFixture.aÉtéCréé) {
      throw new Error(
        `Aucune transmission d'attestation de conformité n'a été crée dans AchèvementWorld`,
      );
    }

    const {
      dateTransmissionAuCocontractant,
      date,
      utilisateur,
      attestation: { format },
    } = this.#modifierAttestationConformitéFixture.aÉtéCréé
      ? this.#modifierAttestationConformitéFixture
      : this.#transmettreAttestationConformitéFixture;

    console.log('coucou');

    try {
      const test = DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Achèvement.TypeDocumentAchèvement.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(date).formatter(),
        format,
      );
      console.log(test);
    } catch (e) {
      console.log(e);
    }

    console.log('coucou II');

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
        DateTime.convertirEnValueType(date).formatter(),
        format,
      ),
      misÀJourLe: DateTime.convertirEnValueType(date),
      misÀJourPar: Email.convertirEnValueType(utilisateur),
    };
  }
}
