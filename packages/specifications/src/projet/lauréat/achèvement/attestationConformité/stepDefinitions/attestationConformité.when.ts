import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

Quand(
  'le porteur transmet une attestation de conformité pour le projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const { identifiantProjet } =
        statutProjet === 'lauréat' ? this.lauréatWorld : this.eliminéWorld;

      const {
        attestation: { content, format },
        dateTransmissionAuCocontractant,
        date,
        utilisateur,
      } = this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer({
        utilisateur: this.utilisateurWorld.porteurFixture.email,
      });

      await mediator.send<Achèvement.TransmettreAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: { format, content },
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: { format, content },
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur transmet une attestation de conformité pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld;

      const {
        attestation: { content, format },
        dateTransmissionAuCocontractant,
        date,
        utilisateur,
      } = this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer({
        utilisateur: this.utilisateurWorld.porteurFixture.email,
        ...(exemple['date transmission au co-contractant'] && {
          dateTransmissionAuCocontractant: new Date(
            exemple['date transmission au co-contractant'],
          ).toISOString(),
        }),
      });

      await mediator.send<Achèvement.TransmettreAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: { format, content },
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: { format, content },
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "l'admin modifie l'attestation de conformité pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const {
        attestation: { content, format },
        dateTransmissionAuCocontractant,
        date,
        utilisateur,
      } = this.lauréatWorld.achèvementWorld.modifierAttestationConformitéFixture.créer({
        utilisateur: this.utilisateurWorld.adminFixture.email,
      });

      await mediator.send<Achèvement.ModifierAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: { format, content },
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: { format, content },
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "l'admin modifie l'attestation de conformité pour le projet lauréat avec :",
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const {
        attestation: { content, format },
        dateTransmissionAuCocontractant,
        date,
        utilisateur,
      } = this.lauréatWorld.achèvementWorld.modifierAttestationConformitéFixture.créer({
        utilisateur: this.utilisateurWorld.adminFixture.email,
        ...(exemple['date transmission au co-contractant'] && {
          dateTransmissionAuCocontractant: new Date(
            exemple['date transmission au co-contractant'],
          ).toISOString(),
        }),
      });

      await mediator.send<Achèvement.ModifierAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: { format, content },
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: { format, content },
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
