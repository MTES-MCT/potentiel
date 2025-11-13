import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../../../potentiel.world';

EtantDonné(
  'une attestation de conformité transmise pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateTransmissionAuCocontractant, date, utilisateur, attestation, preuve } =
      this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.créer({});

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
