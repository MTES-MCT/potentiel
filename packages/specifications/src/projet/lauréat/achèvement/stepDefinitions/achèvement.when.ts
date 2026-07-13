import { type DataTable, When as Quand } from '@cucumber/cucumber';
import { assert } from 'chai';
import { mediator } from 'mediateur';

import type { Lauréat } from '@potentiel-domain/projet';

import { convertFixtureFileToReadableStream } from '../../../../helpers/convertFixtureFileToReadable.js';
import type { PotentielWorld } from '../../../../potentiel.world.js';

// #region Achèvement réel
Quand(
  `le porteur transmet l'achèvement réel pour le projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const { identifiantProjet } =
        statutProjet === 'lauréat' ? this.lauréatWorld : this.éliminéWorld;

      const {
        attestation,
        rapportAssocié,
        preuve,
        dateTransmissionAuCocontractant,
        date,
        utilisateur,
      } = this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer({
        utilisateur: this.utilisateurWorld.porteurFixture.email,
      });

      await mediator.send<Lauréat.Achèvement.TransmettreAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.UseCase.TransmettreAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateValue: date,
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          identifiantUtilisateurValue: utilisateur,
          attestationValue: convertFixtureFileToReadableStream(attestation),
          rapportAssociéValue: convertFixtureFileToReadableStream(rapportAssocié),
          preuveTransmissionAuCocontractantValue: convertFixtureFileToReadableStream(preuve),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur transmet l'achèvement réel pour le projet lauréat avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      const { identifiantProjet } = this.lauréatWorld;

      const {
        attestation,
        rapportAssocié,
        preuve,
        dateTransmissionAuCocontractant,
        date,
        utilisateur,
      } = this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer({
        utilisateur: this.utilisateurWorld.porteurFixture.email,
        ...(exemple['date transmission au Cocontractant'] && {
          dateTransmissionAuCocontractant: new Date(
            exemple['date transmission au Cocontractant'],
          ).toISOString(),
        }),
      });

      await mediator.send<Lauréat.Achèvement.TransmettreAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.UseCase.TransmettreAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          identifiantUtilisateurValue: utilisateur,
          attestationValue: convertFixtureFileToReadableStream(attestation),
          rapportAssociéValue: convertFixtureFileToReadableStream(rapportAssocié),
          preuveTransmissionAuCocontractantValue: convertFixtureFileToReadableStream(preuve),
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "l'admin modifie l'achèvement réel du projet sans pièce justificative",
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const { attestation, dateTransmissionAuCocontractant, date, utilisateur, raison } =
        this.lauréatWorld.achèvementWorld.modifierAchèvementFixture.créer({
          utilisateur: this.utilisateurWorld.dgecFixture.email,
          attestation: undefined,
          rapportAssocié: undefined,
          preuve: undefined,
        });

      await mediator.send<Lauréat.Achèvement.ModifierAchèvementUseCase>({
        type: 'Lauréat.Achèvement.UseCase.ModifierAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation && convertFixtureFileToReadableStream(attestation),
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          utilisateurValue: utilisateur,
          raisonValue: raison,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand("l'admin modifie l'achèvement réel du projet", async function (this: PotentielWorld) {
  try {
    const { identifiantProjet } = this.lauréatWorld;

    const {
      attestation,
      rapportAssocié,
      preuve,
      dateTransmissionAuCocontractant,
      date,
      utilisateur,
      raison,
    } = this.lauréatWorld.achèvementWorld.modifierAchèvementFixture.créer({
      utilisateur: this.utilisateurWorld.dgecFixture.email,
    });

    await mediator.send<Lauréat.Achèvement.ModifierAchèvementUseCase>({
      type: 'Lauréat.Achèvement.UseCase.ModifierAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        dateValue: date,
        dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
        utilisateurValue: utilisateur,
        raisonValue: raison,
        attestationValue: attestation && convertFixtureFileToReadableStream(attestation),
        rapportAssociéValue: rapportAssocié && convertFixtureFileToReadableStream(rapportAssocié),
        preuveTransmissionAuCocontractantValue:
          preuve && convertFixtureFileToReadableStream(preuve),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(
  "l'admin modifie l'achèvement réel du projet avec les mêmes valeurs",
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const achèvement = this.lauréatWorld.achèvementWorld.mapToExpected();
      assert(achèvement.estAchevé, 'impossible de mofidier si non achevé');
      const { attestation, preuve, dateTransmissionAuCocontractant, date, utilisateur, raison } =
        this.lauréatWorld.achèvementWorld.modifierAchèvementFixture.créer({
          utilisateur: this.utilisateurWorld.dgecFixture.email,
          // Quand un document n'est pas changé, on transmet undefined au usecase
          attestation: undefined,
          preuve: undefined,
          dateTransmissionAuCocontractant: achèvement.dateAchèvementRéel.formatter(),
        });

      await mediator.send<Lauréat.Achèvement.ModifierAchèvementUseCase>({
        type: 'Lauréat.Achèvement.UseCase.ModifierAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation && convertFixtureFileToReadableStream(attestation),
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue:
            preuve && convertFixtureFileToReadableStream(preuve),
          utilisateurValue: utilisateur,
          raisonValue: raison,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "l'admin modifie l'achèvement réel du projet avec :",
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const { attestation, preuve, dateTransmissionAuCocontractant, date, utilisateur, raison } =
        this.lauréatWorld.achèvementWorld.modifierAchèvementFixture.créer({
          utilisateur: this.utilisateurWorld.dgecFixture.email,
          ...(exemple['date transmission au Cocontractant'] && {
            dateTransmissionAuCocontractant: new Date(
              exemple['date transmission au Cocontractant'],
            ).toISOString(),
          }),
        });

      await mediator.send<Lauréat.Achèvement.ModifierAchèvementUseCase>({
        type: 'Lauréat.Achèvement.UseCase.ModifierAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: attestation && convertFixtureFileToReadableStream(attestation),
          dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
          dateValue: date,
          preuveTransmissionAuCocontractantValue:
            preuve && convertFixtureFileToReadableStream(preuve),
          utilisateurValue: utilisateur,
          raisonValue: raison,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
// #region Achèvement réel

// #region Date achèvement réelle
Quand(
  "le Cocontractant transmet la date d'achèvement réelle {string} pour le projet {lauréat-éliminé}",
  async function (
    this: PotentielWorld,
    dateAchèvementValue: string,
    statutProjet: 'lauréat' | 'éliminé',
  ) {
    try {
      const { identifiantProjet } =
        statutProjet === 'lauréat' ? this.lauréatWorld : this.éliminéWorld;

      const { dateAchèvement, transmiseLe, transmisePar } =
        this.lauréatWorld.achèvementWorld.transmettreDateAchèvementFixture.créer({
          dateAchèvement: dateAchèvementValue,
        });

      await mediator.send<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>({
        type: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAchèvementValue: dateAchèvement,
          transmiseLeValue: transmiseLe,
          transmiseParValue: transmisePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le Cocontractant corrige la date d'achèvement réelle {string} pour le projet {lauréat-éliminé}",
  async function (
    this: PotentielWorld,
    dateAchèvementValue: string,
    statutProjet: 'lauréat' | 'éliminé',
  ) {
    try {
      const { identifiantProjet } =
        statutProjet === 'lauréat' ? this.lauréatWorld : this.éliminéWorld;

      const { dateAchèvement, corrigéeLe, corrigéePar } =
        this.lauréatWorld.achèvementWorld.corrigerDateAchèvementFixture.créer({
          dateAchèvement: dateAchèvementValue,
        });

      await mediator.send<Lauréat.Achèvement.CorrigerDateAchèvementUseCase>({
        type: 'Lauréat.Achèvement.UseCase.CorrigerDateAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAchèvementValue: dateAchèvement,
          corrigéeLeValue: corrigéeLe,
          corrigéeParValue: corrigéePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le Cocontractant corrige la date d'achèvement réelle avec la même date pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const achèvement = this.lauréatWorld.achèvementWorld.mapToExpected();
      assert(achèvement.estAchevé, 'impossible de corriger si non achevé');

      const { dateAchèvement, corrigéeLe, corrigéePar } =
        this.lauréatWorld.achèvementWorld.corrigerDateAchèvementFixture.créer({
          dateAchèvement: achèvement.dateAchèvementRéel.formatter(),
        });

      await mediator.send<Lauréat.Achèvement.CorrigerDateAchèvementUseCase>({
        type: 'Lauréat.Achèvement.UseCase.CorrigerDateAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          dateAchèvementValue: dateAchèvement,
          corrigéeLeValue: corrigéeLe,
          corrigéeParValue: corrigéePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

// #endregion Date achèvement réelle

// #region Attestation de conformité
Quand(
  `le porteur modifie l'attestation de conformité et son rapport associé`,
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const { attestation, rapportAssocié, modifiéeLe, modifiéePar } =
        this.lauréatWorld.achèvementWorld.modifierAttestationConformitéFixture.créer({
          modifiéePar: this.utilisateurWorld.porteurFixture.email,
        });

      await mediator.send<Lauréat.Achèvement.ModifierAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.UseCase.ModifierAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: convertFixtureFileToReadableStream(attestation),
          estUneNouvelleAttestationValue: true,
          rapportAssociéValue: convertFixtureFileToReadableStream(rapportAssocié),
          estUnNouveauRapportValue: true,
          modifiéeLeValue: modifiéeLe,
          modifiéeParValue: modifiéePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  `le porteur modifie l'attestation de conformité et son rapport associé avec les mêmes documents`,
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const { attestation, rapportAssocié, modifiéeLe, modifiéePar } =
        this.lauréatWorld.achèvementWorld.modifierAttestationConformitéFixture.créer({
          modifiéePar: this.utilisateurWorld.porteurFixture.email,
          attestation:
            this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.attestation,
          rapportAssocié:
            this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture
              .rapportAssocié,
        });

      await mediator.send<Lauréat.Achèvement.ModifierAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.UseCase.ModifierAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationValue: convertFixtureFileToReadableStream(attestation),
          estUneNouvelleAttestationValue: false,
          rapportAssociéValue: convertFixtureFileToReadableStream(rapportAssocié),
          estUnNouveauRapportValue: false,
          modifiéeLeValue: modifiéeLe,
          modifiéeParValue: modifiéePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur enregistre une attestation de conformité avec son rapport associé pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      const { identifiantProjet } = this.lauréatWorld;

      const { attestation, rapportAssocié, enregistréeLe, enregistréePar } =
        this.lauréatWorld.achèvementWorld.enregistrerAttestationConformitéFixture.créer({});

      await mediator.send<Lauréat.Achèvement.EnregistrerAttestationConformitéUseCase>({
        type: 'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          attestationConformitéValue: convertFixtureFileToReadableStream(attestation),
          rapportAssociéValue: convertFixtureFileToReadableStream(rapportAssocié),
          enregistréeLeValue: enregistréeLe,
          enregistréeParValue: enregistréePar,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
// #endregion Attestation de conformité
