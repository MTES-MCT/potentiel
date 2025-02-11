import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Achèvement } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

EtantDonné(
  'une attestation de conformité transmise pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    const { dateTransmissionAuCocontractant, date, utilisateur, attestation, preuve } =
      this.lauréatWorld.achèvementWorld.transmettreOuModifierAttestationConformitéFixture.créer({});

    await mediator.send<Achèvement.TransmettreAttestationConformitéUseCase>({
      type: 'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        attestationValue: attestation,
        dateTransmissionAuCocontractantValue: dateTransmissionAuCocontractant,
        dateValue: date,
        preuveTransmissionAuCocontractantValue: preuve,
        utilisateurValue: utilisateur,
      },
    });
  },
);
