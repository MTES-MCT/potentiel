import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Quand(
  'le porteur transmet une attestation de conformité pour le projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const { identifiantProjet } =
        statutProjet === 'lauréat' ? this.lauréatWorld : this.éliminéWorld;

      const { attestation, preuve, dateTransmissionAuCocontractant, date, utilisateur } =
        this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.créer({
          utilisateur: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Lauréat.Achèvement.TransmettreAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation,
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: preuve,
          identifiantUtilisateurValue: utilisateur,
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

      const { attestation, preuve, dateTransmissionAuCocontractant, date, utilisateur } =
        this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.créer({
          utilisateur: this.utilisateurWorld.porteurFixture.email,
          ...(exemple['date transmission au co-contractant'] && {
            dateTransmissionAuCocontractant: new Date(
              exemple['date transmission au co-contractant'],
            ).toISOString(),
          }),
        });

      await mediator.send<Lauréat.Achèvement.TransmettreAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation,
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: preuve,
          identifiantUtilisateurValue: utilisateur,
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

      const { attestation, preuve, dateTransmissionAuCocontractant, date, utilisateur } =
        this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.créer({
          utilisateur: this.utilisateurWorld.adminFixture.email,
        });

      await mediator.send<Lauréat.Achèvement.ModifierAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation,
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: preuve,
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

      const { attestation, preuve, dateTransmissionAuCocontractant, date, utilisateur } =
        this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.créer({
          utilisateur: this.utilisateurWorld.adminFixture.email,
          ...(exemple['date transmission au co-contractant'] && {
            dateTransmissionAuCocontractant: new Date(
              exemple['date transmission au co-contractant'],
            ).toISOString(),
          }),
        });

      await mediator.send<Lauréat.Achèvement.ModifierAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation,
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue: preuve,
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
