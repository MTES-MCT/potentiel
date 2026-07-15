import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { upload } from '@potentiel-libraries/file-storage';

import { convertFixtureFileToReadableStream } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';
import { transmettreDateAchèvement } from './achèvement.when.js';

// #region Prévisionnel
EtantDonné(
  "une date d'achèvement prévisionnel pour le projet lauréat au {string}",
  async function (this: PotentielWorld, date: string) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
    const dateAchèvementPrévisionnel = DateTime.convertirEnValueType(new Date(date).toISOString())
      .définirHeureÀMidi()
      .formatter();

    this.lauréatWorld.achèvementWorld.calculerDateAchèvementPrévisionnelFixture.créer({
      dateAchèvementPrévisionnel,
    });

    const event: Lauréat.Achèvement.DateAchèvementPrévisionnelCalculéeEvent = {
      type: 'DateAchèvementPrévisionnelCalculée-V1',
      payload: {
        identifiantProjet,
        date: dateAchèvementPrévisionnel,
        calculéeLe: DateTime.now().formatter(),
        raison: 'inconnue',
      },
    };

    await publish(`achevement|${identifiantProjet}`, event);
  },
);
// #endregion Prévisionnel

// #region Réel
// scénario possible avant la mise en place du rapport associé
EtantDonné(
  'une attestation de conformité enregistrée avec son rapport associé pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { enregistréeLe, enregistréePar, attestation, rapportAssocié } =
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
  },
);

EtantDonné(
  'une attestation de conformité modifiée pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { attestation, date, dateTransmissionAuCocontractant, utilisateur, preuve, raison } =
      this.lauréatWorld.achèvementWorld.modifierAchèvementFixture.créer({});

    await mediator.send<Lauréat.Achèvement.ModifierAchèvementUseCase>({
      type: 'Lauréat.Achèvement.UseCase.ModifierAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
        attestationValue: attestation && convertFixtureFileToReadableStream(attestation),
        preuveTransmissionAuCocontractantValue:
          preuve && convertFixtureFileToReadableStream(preuve),
        dateValue: date,
        utilisateurValue: utilisateur,
        raisonValue: raison,
      },
    });
  },
);

EtantDonné(
  `l'achèvement réel transmis pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const {
      dateTransmissionAuCocontractant,
      date,
      attestation,
      utilisateur,
      rapportAssocié,
      preuve,
    } = this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer();

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
  },
);

EtantDonné(
  `l'achèvement réel transmis sans rapport associé pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateTransmissionAuCocontractant, date, attestation, utilisateur, preuve } =
      this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer({});

    await upload(
      Lauréat.Achèvement.DocumentAchèvement.attestationConformité({
        enregistréLe: dateTransmissionAuCocontractant,
        identifiantProjet: identifiantProjet.formatter(),
        attestation,
      }).formatter(),
      convertFixtureFileToReadableStream(preuve).content,
    );

    await upload(
      Lauréat.Achèvement.DocumentAchèvement.preuveTransmissionAttestationConformité({
        dateTransmissionAuCocontractant,
        identifiantProjet: identifiantProjet.formatter(),
        preuveTransmissionAuCocontractant: preuve,
      }).formatter(),
      convertFixtureFileToReadableStream(preuve).content,
    );

    await publish(`achevement|${identifiantProjet.formatter()}`, {
      type: 'AttestationConformitéTransmise-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        dateTransmissionAuCocontractant: DateTime.convertirEnValueType(
          dateTransmissionAuCocontractant,
        ).formatter(),
        date: DateTime.convertirEnValueType(date).formatter(),
        utilisateur: Email.convertirEnValueType(utilisateur).formatter(),
        attestation: { format: attestation.format },
        preuveTransmissionAuCocontractant: { format: preuve.format },
      },
    } satisfies Lauréat.Achèvement.AttestationConformitéTransmiseEventV1);
  },
);

EtantDonné(
  "une date d'achèvement réel transmise pour le projet lauréat",
  async function (this: PotentielWorld) {
    await transmettreDateAchèvement.call(this, this.lauréatWorld.identifiantProjet);
  },
);

EtantDonné(
  "une date d'achèvement réel {string} transmise pour le projet lauréat",
  async function (this: PotentielWorld, date: string) {
    const dateAchèvementRéel = DateTime.convertirEnValueType(new Date(date).toISOString())
      .définirHeureÀMidi()
      .formatter();

    await transmettreDateAchèvement.call(
      this,
      this.lauréatWorld.identifiantProjet,
      dateAchèvementRéel,
    );
  },
);
// #endregion Réel
