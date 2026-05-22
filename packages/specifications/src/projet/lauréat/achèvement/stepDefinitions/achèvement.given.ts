import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { convertFixtureFileToReadableStream } from '../../../../helpers/convertFixtureFileToReadable.js';
import type { PotentielWorld } from '../../../../potentiel.world.js';

EtantDonné(
  `l'achèvement réel transmis pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const {
      dateTransmissionAuCocontractant,
      date,
      utilisateur,
      attestation,
      rapportAssocié,
      preuve,
    } = this.lauréatWorld.achèvementWorld.transmettreAttestationConformitéFixture.créer({});

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
  'une attestation de conformité enregistrée pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { enregistréeLe, enregistréePar, attestation } =
      this.lauréatWorld.achèvementWorld.enregistrerAttestationConformitéFixture.créer({});

    await mediator.send<Lauréat.Achèvement.EnregistrerAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        attestationConformitéValue: convertFixtureFileToReadableStream(attestation),
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
  "une date d'achèvement réel transmise pour le projet lauréat",
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateAchèvement, transmiseLe, transmisePar } =
      this.lauréatWorld.achèvementWorld.transmettreDateAchèvementFixture.créer();

    await mediator.send<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>({
      type: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        dateAchèvementValue: dateAchèvement,
        transmiseLeValue: transmiseLe,
        transmiseParValue: transmisePar,
      },
    });
  },
);

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
        raison: 'inconnue',
      },
    };

    await publish(`achevement|${identifiantProjet}`, event);
  },
);
